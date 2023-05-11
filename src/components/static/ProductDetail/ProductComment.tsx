import Button from '@/components/Button'
import Card from '@/components/Card'
import Modal from '@/components/Modal'
import axios from '@/libs/axiosApi'
import dateFormat from '@/libs/utils/dateFormat'
import { NewReviewProps, ResponseReview } from '@/pages/api/review'
import { useMutation } from '@tanstack/react-query'
import classNames from 'classnames'
import Image from 'next/image'
import { useMemo, useReducer } from 'react'
import { toast } from 'react-toastify'
import { StarRating } from '../StarRating'
import CommentDropMenu from './CommentDropMenu'
import { UpdateReview } from '@/pages/api/review/[reviewId]'
import AvatarLost from '../AvatarLost'

type Props = {
    review?: ResponseReview
    viewContent?: boolean
    newReview?: boolean
    productId: string,
}

type CommentState = {
    isLiked?: boolean
    isEdited?: boolean
    isLoading?: boolean
    rating?: number
    content?: string
    totalLike?: number
}

const rating = [
    {
        rating: 0,
        content: "This furniture is poorly made and fell apart after just a few uses. I would not recommend it to anyone"
    },
    {
        rating: 1,
        content: "I was really disappointed with the quality of this furniture. It looks nice, but it feels cheap and flimsy."
    },
    {
        rating: 2,
        content: "The instructions for assembling this furniture were confusing and difficult to follow. It took me hours to put together"
    },
    {
        rating: 3,
        content: "The price of this furniture is a bit steep, but the quality is definitely worth it. It's well-made and looks great in my home"
    },
    {
        rating: 4,
        content: "Thinking to buy a new one!"
    },
    {
        rating: 5,
        content: "This furniture has held up well over time and still looks as good as new. I would definitely buy it again."
    },
]
const initState = {
    id: '',
    ownerId: '',
    productId: '',
    totalLike: 0,
    content: '',
    rating: 0,
    createdDate: new Date(),
    updatedAt: new Date(),
    name: '',
    nickName: '',
    userCreatedDate: new Date(),
    isLiked: false,
}
export default function ProductComment({ viewContent = true, productId, newReview = false, review }: Props) {

    const [comment, updateComment] = useReducer((prev: ResponseReview, next: CommentState) => {
        const updateCmt = { ...prev, ...next }
        return updateCmt
    }, {
        ...initState,
        productId: productId,
        isEdited: newReview,
        isLoading: false,
        isPending: false,
    })

    useMemo(() => { if (review) updateComment({ ...review }) }, [review])

    const rateContent = rating.find(i => i.rating === comment.rating)?.content || ""
    const userCreateDate = dateFormat(comment.userCreatedDate, "MMMM yyyy")
    const reviewUpdateDate = dateFormat(comment.updatedAt, "PP")

    const mutateLike = useMutation({
        mutationKey: ['ReviewLike', comment.id],
        mutationFn: () => axios.updateProductReview(comment, true),
        onMutate: () => {
            updateComment({ isLoading: true })
        },
        onSuccess: () => {
            if (comment.isLiked) {
                toast.info("Review disliked")
                updateComment({
                    isLiked: false,
                    totalLike: comment.totalLike - 1,
                    isLoading: false
                })
            } else {
                toast.info("Review liked")
                updateComment({
                    isLiked: true,
                    totalLike: comment.totalLike + 1,
                    isLoading: false
                })
            }
        },
    })

    const mutateComment = useMutation({
        mutationKey: ['ProductReviews'],
        mutationFn: (data: UpdateReview) => axios.updateProductReview(data),
        onMutate: () => {
            updateComment({ isLoading: true })
        },
        onSuccess: (res) => {
            toast.success(res.message)
            updateComment({ isEdited: false, isLoading: false })
        },
    })

    const createComment = useMutation({
        mutationKey: ['CreateReview'],
        mutationFn: (data: NewReviewProps) => axios.createProductReview(data),
        onMutate: () => {
            updateComment({ isLoading: true })
        },
        onSuccess: (res) => {
            toast.success(res.message)
            updateComment({ ...initState, isEdited: false, isLoading: false })
        },
        onError: (error: string, variables, context) => {
            toast.error(error)
            updateComment({ isLoading: false })
        },
    })

    function handleCreateComment() {
        if (comment.content.length <= 0) toast.error("Review content required")
        if (!comment.rating) toast.error("Rating required")

        createComment.mutate({
            content: comment.content,
            rating: comment.rating,
            productId: comment.productId,
        })
    }

    function handleUpdateComment() {
        if (comment.isEdited) {
            mutateComment.mutate({
                id: comment.id,
                content: comment.content,
                rating: comment.rating
            })
        } else if (newReview) {
            createComment.mutate({ ...comment })
        } else {
            mutateLike.mutate()
        }
    }

    return (
        <Card type='SearchCard' modify='p-5 relative'>
            {!newReview && viewContent && <div className='hidden group-hover:block absolute top-2 right-2'>
                <CommentDropMenu
                    ownerId={comment.ownerId}
                    isEdited={comment.isEdited}
                    reviewId={comment.id}
                    setIsEdited={(value) => updateComment({ isEdited: value })}
                />
            </div>}

            {/* User */}
            {!newReview && (
                <>
                    <div className="flex items-center mb-4 space-x-4">
                        {comment.avatarUrl ? (
                            <Image className="w-10 h-10 rounded-full border border-priBlack-200/50" src={comment.avatarUrl} alt="" width={50} height={50} />
                        ) : (
                            <AvatarLost width={10} height={10} />
                        )}
                        <div className="space-y-1 font-medium dark:text-white">
                            <p className='text-black first-letter:capitalize dark:text-white'>{comment.nickName ?? comment.name}</p>
                            <time
                                className="block text-sm text-gray-500 dark:text-gray-400"
                            >
                                Joined on {userCreateDate}
                            </time>
                        </div>
                    </div>
                    <div className="flex flex-wrap mb-1">
                        <StarRating ProductRating={comment.rating} setCurRate={(value) => updateComment({ rating: value })} isEdited={comment.isEdited} />
                        <h3 className="ml-2 text-sm font-semibold text-gray-900 dark:text-white text-start">{rateContent}</h3>
                    </div>
                    <footer className="mb-5 text-sm text-gray-500 dark:text-gray-400 text-start">
                        <span>Reviewed in the United Kingdom on </span>
                        <time >{reviewUpdateDate}</time>
                    </footer>
                </>
            )}

            {/* Content */}
            {viewContent &&
                <>
                    {!comment.isEdited ? (
                        <p className="mb-2 font-light text-gray-500 dark:text-gray-300">{comment.content}</p>
                    ) : (
                        <textarea
                            inputMode='text'
                            className={classNames(
                                "rounded-md mb-2 w-full min-h-[120px] font-light border border-priBlack-200/50 text-gray-500 dark:text-gray-800 bg-priBlue-200/50",
                                "hover:ring-priBlue-200 customScrollbar"
                            )}
                            value={comment.content}
                            onChange={(e: any) => updateComment({ content: e.target.value })}
                        />
                    )}

                    {/* Interaction */}
                    <aside>
                        {!newReview && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{comment.totalLike} people found this helpful</p>}
                        <div className="flex items-center mt-3 space-x-3 divide-x divide-gray-200 dark:divide-gray-600">
                            {newReview ? (
                                <Modal
                                    btnProps={{
                                        text: "Create",
                                        modifier: 'bg-priBlue-400 text-white py-1.5 px-2 rounded-lg text-xs',
                                        glowEffect: false,
                                        disabled: comment.isLoading
                                    }}
                                    title='Rate our product'
                                    content={
                                        <StarRating
                                            className='w-10 h-10 mt-2'
                                            ProductRating={comment.rating}
                                            setCurRate={(value) => updateComment({ rating: value })}
                                            isEdited={comment.isEdited}
                                        />
                                    }
                                    acceptCallback={handleCreateComment}
                                />
                            ) : (
                                <Button
                                    text={comment.isEdited ? "Update" : "Helpful"}
                                    modifier='bg-priBlue-400 text-white py-1.5 px-2 rounded-lg text-xs dark:text-white'
                                    glowEffect={false}
                                    onClick={handleUpdateComment}
                                    disabled={comment.isLoading}
                                />
                            )}
                        </div>
                    </aside>
                </>
            }
        </Card>
    )
}