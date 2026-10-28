export interface MenuItem {
    icon: string
    label: string
    route?: string
    color?: string
    onPress?: () => void
}

export interface UserProfile {
    id: string
    name: string
    email: string
    avatar: any
}
