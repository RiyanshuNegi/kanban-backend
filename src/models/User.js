const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['manager', 'user'], default: 'user' }
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function () {
  // If the password hasn't been changed, just return and let Mongoose continue
  if (!this.isModified('password')) return;
  
  // Otherwise, hash the password
  this.password = await bcrypt.hash(this.password, 10);
});

// Instance method to check password validity
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);