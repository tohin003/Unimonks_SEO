// Press features reflected from the AcademyCheck listing. Each entry is a
// publication name; the optional `url` field is left blank until the
// specific article URL is verified, at which point the press strip becomes
// a row of linked anchors instead of static badges.

export type PressMention = {
  publication: string;
  url?: string;
};

export const pressMentions: PressMention[] = [
  { publication: "The Times of India" },
  { publication: "Hindustan Times" },
  { publication: "The Tribune" },
  { publication: "Business Standard" },
  { publication: "ANI" },
  { publication: "Dainik Bhaskar" },
  { publication: "The Print" },
];
