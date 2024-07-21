import { TypeOfAIPlatformType, TypeOfInputType } from "../../core/Prompt";

/**
 * CreatePromptRequest
 */
export interface CreatePromptRequest {
    title: string;
    description: string;
    visibility: string;
    category: string;
    prompt_template: string;
    user_input_format: InputFormat[];
}

export interface InputFormat {
    name: string;
    type: TypeOfInputType;
    placeholder: string;
}

/**
 * CreatePromptResponse
 */
export interface CreatePromptResponse {
    prompt_id: string;
}

/**
 * GetPromptResponse
 */
export interface GetPromptResponse extends CreatePromptRequest {
    author_nickname: string;
    star: number;
    usages: number;
    created: string;
    is_starred_by_user: boolean;
    created_at: string;
    id?: string;
}

/**
 * ExecutePromptRequest
 */
export interface ExecutePromptRequest {
    context: Record<string, string>;
    ai_platform: TypeOfAIPlatformType;
}

export interface ContextFormat {
    name: string;
    content: string;
}

/**
 * ExecutePromptResponse
 */
export interface ExecutePromptResponse {
    full_prompt: string;
    ad: null | string;
}

/**
 * GetPromptListRequest
 */
export interface GetPromptListRequest {
    view_type: string;
    query?: string;
    category?: string;
    sort_by?: string;
    sort_order?: string;
    limit?: number;
    page: number;
}

/**
 * GetPromptListResponse
 */
export interface GetPromptListResponse {
    prompt_info_list: GetPromptResponse[];
}
