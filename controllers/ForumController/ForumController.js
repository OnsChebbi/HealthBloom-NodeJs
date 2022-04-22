
const ForumSection = require("../../models/ForumSection")
const Thread = require("./ForumServices/ThreadService");
const ThreadComment = require("./ForumServices/ThreadCommentServices");
const ThreadCommentLike = require("./ForumServices/ThreadCommentLikeService");

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
    sectionId = request.body.sectionId ;
    try{
        Thread.addThread(title,body,sectionId);
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


exports.getAllThreadsBySection=async (request,response)=>{
    let sectionId = request.params.sectionId;

    try{
        let sections= await Thread.getAllThreadsBySection(sectionId);
        response.send(sections)

    }
    catch(error){
        response.json({success:false,message:error});

    }
}

exports.getOneThread=async (request,response)=>{
    let id=request.params.id;
    
    try{
        let thr = await Thread.getOneThread(id)

        response.send(thr)
        //console.log(thr)
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

exports.addCommentToThread= async (request,response)=>{
    //console.log(request.body)
    threadId=request.body.threadId;
    content=request.body.body;

    try{
        let com = await ThreadComment.addCommentToThread(content,threadId);
        response.send(com);

    }
    catch(error){
        response.json({success:false,message:error});
    
    }
}

exports.deleteCommentFromThread= async (request,response)=>{
    //console.log(request.body)
    let id=request.params.id;

    try{
        let com = await ThreadComment.deleteThreadComment(id);
        response.send(com);

    }
    catch(error){
        response.json({success:false,message:error});
    
    }
}

exports.deleteThread= async (request,response)=>{
    //console.log(request.body)
    let id=request.params.id;

    try{
        let thr = await Thread.deleteThread(id);
        response.send(thr);

    }
    catch(error){
        response.json({success:false,message:error});
    }
}

exports.addLikeToComment = async (request, response) => {
    let userId=request.body.userId;
    let commentId=request.body.commentId;

    try{
        let comLike = await ThreadCommentLike.addLikeToComment(userId,commentId);
        response.send(comLike);
    }
    catch(error){
        response.json({success:false,message:error});
    
    }
}


exports.deleteLikeFromComment= async (request,response)=>{
    //console.log(request.body)
    let userId=request.params.userId;
    let commentId=request.params.commentId;

    console.log(userId)
    console.log(commentId)

    try{
        let com = await ThreadCommentLike.deleteLikeFromComment(userId,commentId);
        response.send(com);

    }
    catch(error){
        response.json({success:false,message:error});
    
    }
}