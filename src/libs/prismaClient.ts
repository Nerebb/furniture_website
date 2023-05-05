import { Prisma, PrismaClient } from "@prisma/client"

declare global {
    var prisma: PrismaClient | undefined
}

const prismaClient = globalThis.prisma || new PrismaClient()
if (process.env.NODE_ENV !== "production") globalThis.prisma = prismaClient


/**
 * @description Prisma middleWares - SoftDelete on specified model - return DateTime
 * @allowedSoftDelete List of table that allow softDelete - others will be hard delete
 */

const allowedSoftDelete: Prisma.MiddlewareParams['model'][] = ["User", 'Account', 'Product']
// const databaseDateTime = ['userVerified', 'emailVerified', 'deleted']

prismaClient.$use(async (params, next) => {
    // SoftDelete
    if (allowedSoftDelete.includes(params.model)) {
        try {
            if (params.action == 'delete') {
                // Delete queries
                // Change action to an update
                params.action = 'update'
                params.args['data'] = { deleted: new Date() }
            }
            if (params.action == 'deleteMany') {
                // Delete many queries
                params.action = 'updateMany'
                if (params.args.data != null) {
                    params.args.data['deleted'] = new Date()
                } else {
                    params.args['data'] = { deleted: new Date() }
                }
            }
        } catch (error) {
            throw error
        }
    }
    return next(params)
})

export default prismaClient