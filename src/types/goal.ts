export interface GoalRequest {
    type: string,
    url: string
}

export interface Goal {
    id: string,
    title: string,
    byling: string,
    color: string,
    image: string
}

export interface GoalResponse {
    status: boolean
    error: string
    count: number
    items: Goal[]
    
}
