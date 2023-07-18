
import mongoose from 'mongoose';
const studentSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
        },
        email: {
            type: String,
            unique: true,
        },
        password: {
            type: String,
        },
        dateOfBirth: {
            type: Date,
        },
        gender: {
            type: String,
        },
        phone: {
            type: Number,
            unique:true
        },
        aadharNumber: {
            type: String,
        },
        isVerified:{
            type:Boolean,
            default:false
        },
        isRequested:{
            type:Boolean,
            default:false
        },
        studentImage: {
            public_id: {
              type: String,
            },
            url: {
              type: String,
            },
          },
        parentName: {
            type: String,
        },
        parentMobileNumber: {
            type: Number,
        },
        bloodGroup: {
            type: String,
        },
        address: {
            houseName: {
                type: String,
            },
            area: {
                type: String,
            },
            landMark: {
                type: String,
            },
            city: {
                type: String,
            },
            state: {
                type: String,
            },
            country: {
                type: String,
            },
            pincode: {
                type: Number,
            },
        },
        isSignUpWithGoogle:{
            type:Boolean
        },
        image: {
            url: {
                type: String,
            },
            publicId: {
                type: String,
            },
        },

        role: {
            type: String,
            enum: ["guest", "resident"],
            default: "guest",
        },

        roomData: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'HostelRooms',
        },

        hostelId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'HostelInfo',
        },

        walletTotal: {
            type: Number,
            default: 0
        },
        walletDetails: [
            {
                type: String
            }
        ],
        dateOfAdmission: {
            type: Date,
        },

        isBlocked: {
            type: Boolean,
            default: false,
        },
        rejectedReason: {
            type: String,
            default: "none"
        },
        isProfile:{
            type:String,
            default:'notCompleted'
        }
    },
    { timestamps: true }
);

const Student = mongoose.model('Student', studentSchema);

export default Student;