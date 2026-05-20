export interface GoalRequest {
    type: string,
    url: string
}

export interface Goal {
  id: string
  title: string
  byline: string
  color: string
  icon: string
  image: string
}

export interface GoalResponse {
  status: boolean
  error: string
  count: number
  items: Goal[]
}

/*
RULES / TERMINOLOGY:
- interface = TypeScript contract for object shape.
- Goal = one card data object.
- GoalResponse = full JSON response from goals.json.
- Goal[] = array of Goal objects.
*/