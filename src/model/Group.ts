export type Group = {
	id: number;
	name: string;
	created_at: Date;
	updated_at: Date;
	is_public: number;
	owner_id: number | null;
	image_uid: string | null;
	image_url: string | null;
};