import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Complaints from "../../models/complaints.js";
import HostelInfo from "../../models/hostelInfo.js";
import HostelAdmin from '../../models/hostelAdmin.js'

dotenv.config();


// login data
export const login = async (req, res, next) => {

  const { email, password } = req.body
  if (process.env.ADMIN_EMAIL === email && process.env.ADMIN_PASSWORD === password) {
    const payload = {
      email: email,
    };
    jwt.sign(
      payload,
      process.env.ADMIN_SECRET,
      {
        expiresIn: 3600000,
      },

      (err, token) => {
        if (err) console.error("Errors in Token generating");

        else {
          res.json({
            status: true,
            email: email,
            token: `Bearer ${token}`,
          });
        }
      }
    );
  } else {
    const error = "Incorrect email or password";
    res.json({ errors: error });
  }
};


// hostels requests
export const requests = async (req, res, next) => {
  try {
    const result = await HostelInfo.find({ isApproved: 'Pending' })
      .populate({
        path: "adminData",
        select: "fullName mobile email",
      })
      .select("hostelName hostelImage location description adminData");
    res.json(result);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// hostel approval
export const approval = async (req, res, next) => {
  try {
    const Id = req.params.id.trim();

    const hostelData = await HostelInfo.findOne({ _id: Id });

    if (hostelData.isApproved === 'Pending') {
      hostelData.isApproved = 'Approved';
      await hostelData.save();

      const success = "Hostel approved";
      res.status(200).json({ message: success });
    } else {
      const success = "Hostel is already approved";
      res.status(200).json({ message: success });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// hostel rejection
export const rejected = async (req, res, next) => {
  try {
    const id = req.params.id;
    const description = req.body.description;

    const hostelData = await HostelInfo.findOne({ _id: id });

    if (hostelData.isApproved === 'Pending') {
      hostelData.isApproved = 'Rejected';
      hostelData.rejectedReason = description;
      await hostelData.save();

      const success = 'Hostel Rejected';
      res.status(200).json({ message: success });
    } else {
      const success = 'Hostel is already Rejected';
      res.status(200).json({ message: success });
    }

  } catch (err) {
    console.log(err);
    next(err);
  }
};

// fetch hostels data
export const hostelData = async (req, res, next) => {
  try {
    const hostelData = await HostelInfo.find({})
      .populate({ path: 'adminData', select: 'email' })
      .select('_id hostelName isBlocked');
    res.status(200).json(hostelData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// block hostel
export const blockHostel = async (req, res, next) => {
  try {

    const id = req.params.id
    const adminId = req.params.adminId

    const hostelData = await HostelInfo.findOne({ _id: id });
    const adminData = await HostelAdmin.findOne({ _id: adminId })

    if (hostelData) {
      if (hostelData.isBlocked === false) {
        hostelData.isBlocked = true
        await hostelData.save();

        if (adminData) {
          if (adminData.isBlocked === false) {
            adminData.isBlocked = true
            await adminData.save()
          }

        }

        res.status(200).json({ message: 'Success' })
      }
    }

  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// unblock hostel
export const unblockHostel = async (req, res, next) => {
  try {

    const id = req.params.id
    const adminId = req.params.adminId

    const hostelData = await HostelInfo.findOne({ _id: id });
    const adminData = await HostelAdmin.findOne({ _id: adminId })

    if (hostelData) {
      if (hostelData.isBlocked === true) {
        hostelData.isBlocked = false
        await hostelData.save();

        if (adminData) {
          if (adminData.isBlocked === true) {
            adminData.isBlocked = false
            await adminData.save()
          }

        }

        res.status(200).json({ message: 'Success' })
      }
    }

  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}


// fetch admin dashboard

export const adminDashboard = async (req,res,next) =>{
  try{
    const hostelCount = await HostelInfo.find().count()
    const requestCount = await HostelInfo.find({isApproved:"Pending"}).count()
    const complaintsCount = await Complaints.find().count()
    const blockedCount = await HostelInfo.find({isBlocked:true}).count()

    res.status(200).json({hostelCount,requestCount,complaintsCount,blockedCount})

  }catch(error){
    console.log(error);
    res.status(500).json({error:"Internal server error"})
  }
}


//fetch chart data
export const adminChartData = async (req,res,nest) =>{
  try{
    const FIRST_MONTH = 1
    const LAST_MONTH = 12
    const TODAY = new Date()
    const YEAR_BEFORE = new Date(TODAY)
    YEAR_BEFORE.setFullYear(YEAR_BEFORE.getFullYear() - 1)
    console.log(TODAY, YEAR_BEFORE)
    const MONTHS_ARRAY = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const pipeLine = [{
      $match: {
        createdAt: { $gte: YEAR_BEFORE, $lte: TODAY }
      }
    },
    {
      $group: {
        _id: { year_month: { $substrCP: ["$createdAt", 0, 7] } },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { "_id.year_month": 1 }
    },
    {
      $project: {
        _id: 0,
        count: 1,
        month_year: {
          $concat: [
            { $arrayElemAt: [MONTHS_ARRAY, { $subtract: [{ $toInt: { $substrCP: ["$_id.year_month", 5, 2] } }, 1] }] },
            "-",
            { $substrCP: ["$_id.year_month", 0, 4] }
          ]
        }
      }
    },
    {
      $group: {
        _id: null,
        data: { $push: { k: "$month_year", v: "$count" } }
      }
    },
    {
      $addFields: {
        start_year: { $substrCP: [YEAR_BEFORE, 0, 4] },
        end_year: { $substrCP: [TODAY, 0, 4] },
        months1: { $range: [{ $toInt: { $substrCP: [YEAR_BEFORE, 5, 2] } }, { $add: [LAST_MONTH, 1] }] },
        months2: { $range: [FIRST_MONTH, { $add: [{ $toInt: { $substrCP: [TODAY, 5, 2] } }, 1] }] }
      }
    },
    {
      $addFields: {
        template_data: {
          $concatArrays: [
            {
              $map: {
                input: "$months1",
                as: "m1",
                in: {
                  count: 0,
                  month_year: {
                    $concat: [
                      { $arrayElemAt: [MONTHS_ARRAY, { $subtract: ["$$m1", 1] }] },
                      "-",
                      "$start_year"
                    ]
                  }
                }
              }
            },
            {
              $map: {
                input: "$months2",
                as: "m2",
                in: {
                  count: 0,
                  month_year: {
                    $concat: [
                      { $arrayElemAt: [MONTHS_ARRAY, { $subtract: ["$$m2", 1] }] },
                      "-",
                      "$end_year"
                    ]
                  }
                }
              }
            }
          ]
        }
      }
    },
    {
      $addFields: {
        data: {
          $map: {
            input: "$template_data",
            as: "t",
            in: {
              k: "$$t.month_year",
              v: {
                $reduce: {
                  input: "$data",
                  initialValue: 0,
                  in: {
                    $cond: [
                      { $eq: ["$$t.month_year", "$$this.k"] },
                      { $add: ["$$this.v", "$$value"] },
                      { $add: [0, "$$value"] }
                    ]
                  }
                }
              }
            }
          }
        }
      }
    },
    {
      $project: {
        data: { $arrayToObject: "$data" },
        _id: 0
      }
    }]

    const blockPipeLine = [
      {
        $match: {
          isApproved: { $in: ['Pending'] },
          isBlocked: false,
          createdAt: { $gte: YEAR_BEFORE, $lte: TODAY }
        }
      },
    ];

    const requestPipLine = [
      {
        $match: {
          isApproved: { $in: ['Approved', 'Pending'] },
          isBlocked: true,
          createdAt: { $gte: YEAR_BEFORE, $lte: TODAY }
        }
      },
    ]

    const hostelChart = await HostelInfo.aggregate(pipeLine)
    const complaintChart = await Complaints.aggregate(pipeLine)
    const blockedChart = await HostelInfo.aggregate(blockPipeLine)
    const requestChart = await HostelInfo.aggregate(requestPipLine)

    res.status(200).json({hostelChart,complaintChart,blockedChart,requestChart})


  }catch(error){
    res.status(500).json({error:"Internal server error"})
  }
}