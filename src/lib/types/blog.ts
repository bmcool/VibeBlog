export interface BlogPost {
	slug: string;
	title: string;
	date: string;
	description: string;
	content: string;
	htmlContent?: string;
	image?: string;
}

export type Language = 'zh' | 'en';

export interface PostMeta {
	slug: string;
	title: string;
	titleEn?: string;
	date: string;
	tags: string[];
	tagsEn?: string[];
	summary?: string;
	summaryEn?: string;
	heroImage?: string;
	description?: string;
	descriptionEn?: string;
}

export interface TagsIndex {
	[tag: string]: string[];
}

