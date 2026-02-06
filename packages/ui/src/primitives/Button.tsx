import { Pressable, Text } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const buttonVariants = cva(
  "flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-input bg-transparent",
        ghost: "bg-transparent",
        link: "bg-transparent underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps extends VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  className?: string;
}

/**
 * 跨平台Button组件
 * 使用NativeWind，可以在Web和Mobile上使用
 */
export function Button({
  children,
  variant,
  size,
  onPress,
  disabled = false,
  className,
}: ButtonProps) {
  return (
    <Pressable
      className={cn(buttonVariants({ variant, size }), className)}
      onPress={onPress}
      disabled={disabled}
    >
      {typeof children === "string" ? (
        <Text
          className={cn(
            "font-medium",
            variant === "default" && "text-white",
            variant === "secondary" && "text-gray-900",
            variant === "destructive" && "text-white",
            variant === "outline" && "text-gray-900",
            variant === "ghost" && "text-gray-900",
            variant === "link" && "text-primary",
          )}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
