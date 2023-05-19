import mongoose from 'mongoose'

const hosteladminSchema  = new mongoose.Schema(
    {
        adminId:{
            type:String,
            required :true,
            unique: true,
            trim: true,
            uppercase: true
        },
        hosteldata:[
            {
                hostelId:{
                    type:String,
                    required
                },
                hostelName:{
                    type:String,
                    required:true
                },

            }
        ],
        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        mobile:{
            type:Number,
            required:true
        },
        gender:{
            type:String,
            required:true
        },
        adminImage: {
            url: {
              type: String,
            },
            filename: {
              type: String,
            },
          },
        isApproved:{
            type:Boolean,
            default:false
        },
        paymentStatus:{
            type:String,
            default:"not Paid"
        },
        qualificaton:{
            type:String,
            required
        },
        Address:[
            {
                landMark:{
                    type:String,
                    required:true
                },
                area:{
                    type:String,
                    required:true
                }
            }
        ]
    },
    { timestamps: true }
);

const hosteladmin = mongoose.model("hosteladmin",hosteladminSchema)

export default hosteladmin