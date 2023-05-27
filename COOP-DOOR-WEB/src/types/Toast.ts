export interface Toast{
    type: "error"|"warning" | "success" | "info", 
    message: string
    duration?: number
}