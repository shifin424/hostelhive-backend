import mongoose from 'mongoose';


const menuSchema = new mongoose.Schema(
{
  hostelId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HostelInfo',
    required:true
  },
  day: {
    type: String,
    required: true,
  },
  breakfast: {
    type: String,
    required: true,
  },
  lunch: {
    type: String,
    required: true,
  },
  snacks: {
    type: String,
    required: true,
  },
  dinner: {
    type: String,
    required: true,
  },
});

const Menu =  mongoose.model("Menu", menuSchema);

export default Menu;