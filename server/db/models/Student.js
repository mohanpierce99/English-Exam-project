const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
	//student
	id:{
		type: Number,
		minlength: 12,
		required: true,
		trim: true,
		unique: [true,"User already Exists"]
		},
		marks:{
			type:Array,
			required:false,
		},
	name:{
       	type:String,
       	minlength:[3,"Too small"],
       	required:true,
       	trim :true
		},
	//---->ma'am
    batch:{
       	type:Number,
       	required:true
       	},
    department:{
    	type:String,
   	   	required:true
   		},
	class:{
   	   	type:String,
   	   	required:true
       	},
 	// till this<----
	login_count:{
		type:Number,
		validate:{
				validator:function(data){
					return !(data>12);
					},
				message:x=>"Span completed"
				},
			required:true
   		},
	is_loggedin:{
		type:Boolean,
        required:true
   		},
	sections:{
     	type:Object,
     	required:true
		 },
		 token:{
			 type:String
		 }
});

const Student = mongoose.model('students' , studentSchema);

module.exports=Student;

