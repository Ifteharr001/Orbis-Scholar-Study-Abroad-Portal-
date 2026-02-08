import mongoose, { Schema, Document, Model } from "mongoose";


interface ITask {
  id: number;
  name: string;
  status: "done" | "pending" | "locked" | "verified";
  auto: boolean;
  hasLink: boolean;
  hasUpload: boolean;
  fileUrl?: string;
  fileName?: string;
}

interface ITravel {
  departureDate?: Date;
  flightNumber?: string;
  departureTime?: string;
  arrivalTime?: string;
  needsPickup: boolean;
  accommodationAddress?: string;
}

interface IPackingItem {
  name: string;
  checked: boolean;
}


export interface IVisaProcess extends Document {
  studentEmail: string;
  progress: number;
  tasks: ITask[];
  medicalDate?: Date;
  embassyDate?: Date;
  travel?: ITravel;
  packingList?: IPackingItem[];
  createdAt: Date;
  updatedAt: Date;
}


const VisaProcessSchema = new Schema<IVisaProcess>(
  {
    studentEmail: { type: String, required: true, unique: true },
    
    progress: { 
      type: Number, 
      default: 0, 
      min: [0, "Progress cannot be less than 0"], 
      max: [100, "Progress cannot be more than 100"] 
    },
    
    tasks: [
      {
        id: Number,
        name: String,
        status: { 
          type: String, 
          enum: ["done", "pending", "locked", "verified"], 
          default: "locked" 
        },
        auto: Boolean,
        hasLink: Boolean,
        hasUpload: Boolean,
        fileUrl: String,
        fileName: String
      }
    ],

    medicalDate: { type: Date },
    embassyDate: { type: Date },

    travel: {
      departureDate: Date,
      flightNumber: String,
      departureTime: String,
      arrivalTime: String,
      needsPickup: { type: Boolean, default: false },
      accommodationAddress: String
    },

    // Packing List
    packingList: [
      { name: String, checked: { type: Boolean, default: false } }
    ]
  },
  { timestamps: true } 
);

const VisaProcess: Model<IVisaProcess> = mongoose.models.VisaProcess || mongoose.model<IVisaProcess>("VisaProcess", VisaProcessSchema);

export default VisaProcess;