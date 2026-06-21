import { CATEGORIES, type Category } from "@/lib/categories";
import { getSeedPages } from "@/lib/seed-content";

export function getArchiveEntries() {
  return getSeedPages()
    .slice()
    .sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at));
}

export function getEntriesByCategory(category: Category) {
  return getArchiveEntries().filter((entry) => entry.category === category);
}

export function getFeaturedArchive(limit = 6) {
  return getArchiveEntries()
    .slice()
    .sort((a, b) => b.view_count - a.view_count)
    .slice(0, limit);
}

export function getArchiveByAuthor(username: string) {
  return getArchiveEntries().filter((entry) => entry.profiles.username === username);
}

export function getCategoryGroups() {
  return CATEGORIES.map((category) => ({
    category,
    entries: getEntriesByCategory(category),
  })).filter((group) => group.entries.length > 0);
}
