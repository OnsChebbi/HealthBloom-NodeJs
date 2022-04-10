const ForumSection = require("../../models/ForumSection")
const Thread = require("../../models/Thread")

exports.addForumSection=async (request,response)=>{
    console.log(request.body)
    title=request.body.title;
    description=request.body.description;
    image= request.body.image;
    try{
        ForumSection.addForumSection(title,description,image);
        response.json({success:true,message:"ForumSection added successfully"});

    }
    catch(error){
        response.json({success:false,message:error});
    
    }
}

exports.addThread=async (request,response)=>{
    console.log(request.body)
    title=request.body.title;
    body=request.body.body;

    try{
        Thread.addThread(title,body);
        response.json({success:true,message:"Thread added successfully"});

    }
    catch(error){
        response.json({success:false,message:error});
    
    }
}


exports.getAllForumSections=async (request,response)=>{
    try{
        let sections= await ForumSection.getAllForumSections();
        response.send(sections)

    }
    catch(error){
        response.json({success:false,message:error});

    }
}

exports.getAllThreads=async (request,response)=>{
    try{
        let sections= await Thread.getAllThreads();
        response.send(sections)

    }
    catch(error){
        response.json({success:false,message:error});

    }
}


exports.deleteForumSection=async (request,response)=>{
    let id=request.params.id;
    try{
         ForumSection.deleteForumSection(id);
         response.json({success:true,message:"Forum Section deleted successfully"});
    }
    catch(error){
        response.json({success:false,message:error});
    }
}