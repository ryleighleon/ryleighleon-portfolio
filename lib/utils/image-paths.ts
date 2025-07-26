export function getIconUrl(iconName: string): string {
  return `/media/files/icons/${iconName}`
}

export function getPersonalPictureUrl(iconName: string): string {
  return `/media/files/personal_pictures/${iconName}`
}

/**
 * Validates and formats a UID string
 * Only allows lowercase letters, numbers, and hyphens
 */
export function formatUid(input: string): string {
  // Convert to lowercase
  let formatted = input.toLowerCase()

  // Replace spaces with hyphens
  formatted = formatted.replace(/\s+/g, "-")

  // Remove any characters that aren't lowercase letters, numbers, or hyphens
  formatted = formatted.replace(/[^a-z0-9-]/g, "")

  // Remove consecutive hyphens
  formatted = formatted.replace(/-+/g, "-")

  // Remove leading and trailing hyphens
  formatted = formatted.replace(/^-+|-+$/g, "")

  return formatted
}
