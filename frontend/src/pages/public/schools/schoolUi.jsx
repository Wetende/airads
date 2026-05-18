import { Box, Chip, Typography } from "@mui/material";
import {
  AutoAwesome,
  Bolt,
  Build,
  CameraAlt,
  CheckCircle,
  ContentCut,
  EmojiEvents,
  Favorite,
  Home,
  LocalActivity,
  LocalHospital,
  Mail,
  Mic,
  Palette,
  People,
  Place,
  Radio,
  Restaurant,
  RestaurantMenu,
  Schedule,
  Security,
  TheaterComedy,
  TrackChanges,
  Tv,
  Work,
  WorkspacePremium,
} from "@mui/icons-material";

export function CardHeader({ children, className }) {
  return <Box className={className} sx={{ p: 2.5, pb: 1 }}>{children}</Box>;
}

export function CardTitle({ children, className }) {
  return (
    <Typography className={className} variant="h6" sx={{ fontWeight: 700 }}>
      {children}
    </Typography>
  );
}

export function CardDescription({ children, className }) {
  return (
    <Typography className={className} variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6, mt: 1 }}>
      {children}
    </Typography>
  );
}

export function Badge({ children, className, variant = "filled" }) {
  return (
    <Chip
      className={className}
      component="span"
      label={children}
      size="small"
      variant={variant === "outline" ? "outlined" : "filled"}
      sx={{ fontWeight: 600 }}
    />
  );
}

export const Activity = LocalActivity;
export const Award = EmojiEvents;
export const Briefcase = Work;
export const Camera = CameraAlt;
export const CheckCircleIcon = CheckCircle;
export const ChefHat = Restaurant;
export const Clock = Schedule;
export const Crown = WorkspacePremium;
export const Film = TheaterComedy;
export const Heart = Favorite;
export const MapPin = Place;
export const Monitor = Tv;
export const Scissors = ContentCut;
export const Shield = Security;
export const Sparkles = AutoAwesome;
export const Stethoscope = LocalHospital;
export const Target = TrackChanges;
export const Users2 = People;
export const Utensils = RestaurantMenu;
export const Wrench = Build;
export const Zap = Bolt;
export { Home, Mail, Mic, Palette, Radio, Tv };
