import { prisma } from "../../shared/prisma.js";

export class UserRepository {
    async createUser(email: string){
        return prisma.user.create({
            data: {
                email: email
            }
        })
    }
    
    async findUser(email: string){
        return prisma.user.findUnique({
            where: { email }
        })
    }
}