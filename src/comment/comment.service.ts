import { Injectable, NotFoundException } from '@nestjs/common';
import { error } from 'console';
import { NotFoundError } from 'rxjs';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CommentService {

    constructor(private readonly databaseService:DatabaseService){}


    async postComment(postId:number,userId:number,content:string){
        try{
            const newComment = await this.databaseService.post.update({where:{id:postId},data:{
                Comment:{
                    create:{
                        content:content,
                        commentUserId:userId,
                        
                    }
                }
            }})
            return newComment
        }catch{
            throw new NotFoundException("Post not found")
        }
    }

    async findOne(id:number){
        try{
            const foundComment = await this.databaseService.comment.findUnique({where:{id}})
            return foundComment
        }catch{
            throw new NotFoundException("comment not founds")
        }
    }

    async updateComment(id:number,commentUserId:number,content:string){
        try{
            const updatedComment = await this.databaseService.comment.update({where:{id,commentUserId},data:{
                    content
            }})
        }catch{
            throw new Error("Error while updating comment")
                }
    }
    async removeComment(id:number,userId:number){
        try{
            return await this.databaseService.comment.delete({where:{id,commentUserId:userId}})
            
        }catch{
            throw new Error("Error while deleting comment")
        }
    }
    async commentFromPost(postId:number){
        try{
            const foundComments =this.databaseService.comment.findMany({where:{
                postId
            },select:{
                content:true,
                commentedBy:{
                    select:{
                        name:true,
                    }
                }
            }})
            return foundComments??[]
        }catch{
            throw new NotFoundException("comment not founds")
        }
    }
}
