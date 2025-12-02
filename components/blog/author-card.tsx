import Link from "next/link";
import Image from "next/image";
import {
  Twitter,
  Linkedin,
  Github,
  Globe,
  Instagram,
  Youtube,
  Briefcase,
  Building,
  MapPin,
  Award,
  Mail,
  Phone,
} from "lucide-react";
import { Author } from "@/lib/wordpress/adapters/author";
import { Badge } from "@/components/ui/badge";

interface AuthorCardProps {
  author: Author;
  variant?: "compact" | "full";
  showPostCount?: boolean;
}

/**
 * Social icon mapping for author profiles
 */
const socialIcons = {
  twitter: Twitter,
  linkedin: Linkedin,
  github: Github,
  website: Globe,
  instagram: Instagram,
  youtube: Youtube,
};

/**
 * Professional info icon mapping
 */
const professionalIcons = {
  jobTitle: Briefcase,
  company: Building,
  location: MapPin,
  expertise: Award,
  contactEmail: Mail,
  phone: Phone,
};

/**
 * Author Card Component
 * Displays author information in compact or full variants
 *
 * Compact: For use below blog posts (smaller, concise)
 * Full: For author archive pages (complete profile)
 */
export function AuthorCard({
  author,
  variant = "compact",
  showPostCount = false,
}: AuthorCardProps) {
  const isCompact = variant === "compact";
  const social = author.customFields?.social;
  const professional = author.customFields?.professional;
  const contact = author.customFields?.contact;
  const authorBadge = author.customFields?.authorBadge;

  // Compact variant - used below blog posts
  if (isCompact) {
    return (
      <div className="mt-12 pt-8 border-t border-border">
        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="flex gap-6 flex-col sm:flex-row">
            {/* Avatar */}
            {author.avatar?.url && (
              <div className="flex-shrink-0">
                <Image
                  src={author.avatar.url}
                  alt={author.name}
                  width={96}
                  height={96}
                  className="rounded-full"
                  unoptimized={!author.avatar.url.includes('gravatar.com')}
                />
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Name and Badge */}
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h3 className="text-2xl font-bold">{author.name}</h3>
                {authorBadge && (
                  <Badge variant="secondary" size="sm">
                    {authorBadge}
                  </Badge>
                )}
              </div>

              {/* Job Title & Company */}
              {(professional?.jobTitle || professional?.company) && (
                <p className="text-muted-foreground mb-3">
                  {professional.jobTitle}
                  {professional.jobTitle && professional.company && " at "}
                  {professional.company}
                </p>
              )}

              {/* Bio */}
              {author.description && (
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {author.description}
                </p>
              )}

              {/* Social Links - Icons only */}
              {social && Object.keys(social).some(key => social[key as keyof typeof social]) && (
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  {Object.entries(social).map(([platform, url]) => {
                    if (!url) return null;
                    const Icon = socialIcons[platform as keyof typeof socialIcons];
                    return (
                      <Link
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                        aria-label={platform}
                      >
                        <Icon className="w-5 h-5" />
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Selected Custom Fields */}
              <div className="space-y-2 text-sm">
                {professional?.location && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span>Location: {professional.location}</span>
                  </div>
                )}
                {professional?.expertise && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Award className="w-4 h-4 flex-shrink-0" />
                    <span>Expertise: {professional.expertise}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full variant - used on author archive pages
  return (
    <div className="bg-card rounded-lg p-8 border border-border mb-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-8 flex-col md:flex-row">
          {/* Large Avatar */}
          {author.avatar?.url && (
            <div className="flex-shrink-0">
              <Image
                src={author.avatar.url}
                alt={author.name}
                width={160}
                height={160}
                className="rounded-full"
                unoptimized={!author.avatar.url.includes('gravatar.com')}
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Name and Badge */}
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <h1 className="text-4xl font-bold">{author.name}</h1>
              {authorBadge && (
                <Badge variant="default">{authorBadge}</Badge>
              )}
            </div>

            {/* Job Title & Company */}
            {(professional?.jobTitle || professional?.company) && (
              <p className="text-xl text-muted-foreground mb-4">
                {professional.jobTitle}
                {professional.jobTitle && professional.company && " at "}
                {professional.company}
              </p>
            )}

            {/* Bio */}
            {author.description && (
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {author.description}
              </p>
            )}

            {/* Social Links - Icons with Labels */}
            {social && Object.keys(social).some(key => social[key as keyof typeof social]) && (
              <div className="flex items-center gap-4 mb-6 flex-wrap">
                {Object.entries(social).map(([platform, url]) => {
                  if (!url) return null;
                  const Icon = socialIcons[platform as keyof typeof socialIcons];
                  const label = platform.charAt(0).toUpperCase() + platform.slice(1);
                  return (
                    <Link
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm">{label}</span>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* All Custom Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {professional?.location && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium">Location:</span>
                  <span>{professional.location}</span>
                </div>
              )}
              {professional?.expertise && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Award className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium">Expertise:</span>
                  <span>{professional.expertise}</span>
                </div>
              )}
              {contact?.contactEmail && !author.customFields?.hideEmail && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium">Email:</span>
                  <a
                    href={`mailto:${contact.contactEmail}`}
                    className="hover:text-primary transition-colors"
                  >
                    {contact.contactEmail}
                  </a>
                </div>
              )}
              {contact?.phone && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium">Phone:</span>
                  <a
                    href={`tel:${contact.phone}`}
                    className="hover:text-primary transition-colors"
                  >
                    {contact.phone}
                  </a>
                </div>
              )}
            </div>

            {/* Stats */}
            {showPostCount && author.postCount !== undefined && (
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {author.postCount}
                  </span>{" "}
                  {author.postCount === 1 ? "article" : "articles"} published
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
