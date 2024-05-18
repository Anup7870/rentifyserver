import mongoose from 'mongoose';

const propSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    type:{
        type: String,
        required: true
    },
    for_:{
        type: String,
        required: true
    },
    prize:{
        type: Number,
        required: true
    },
    bed:{
        type: Number,
        required: true
    },
    bath:{
        type: Number,
        required: true
    },
    area:{
        type: Number,
        required: true
    },
    discription:{
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    pincode:{
        type: Number,
        required: true
    },
    nearby:{
        hospital:{
            type: Boolean,
            required: true
        },
        school:{
            type: Boolean,
            required: true
        },
        playground:{
            type: Boolean,
            required: true
        },
        
    },
    image:{
        type: String,
        required: true
    },
    likes:{
        type: [String],
        default: []
    }
    

})

const Prop = mongoose.model('Prop', propSchema);

export default Prop;