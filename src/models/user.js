const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true
    },
    username: {
        type: String,
        // required: true,
        unique: true,
        index: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", 'admin'],
        default: 'user'
    },
    phone: {
        type: String
    },
    profilePicture: {
        type: String
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

// UserSchema.virtual('password')
// .set(function(password){
//     this.password =  bcrypt.hashSync(password,10);
// })
UserSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})

// UserSchema.virtual("fullName")
// .get(function(){
//     return `${this.name}`
// })
UserSchema.methods.generateToken = async function () {
    try {
        let token = jwt.sign({
            _id: this._id,
            role: this.role
        }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({
            token: token
        })
        await this.save();
        return token;
    } catch (err) {
       console.log(err)
    }
}
// UserSchema.methods = {
//     authenticate : function(password){
//         return bcrypt.compare(password, this.password)
//     }
// }
module.exports = mongoose.model('User', UserSchema);