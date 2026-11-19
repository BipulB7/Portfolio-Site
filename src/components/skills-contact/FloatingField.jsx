import { cn } from "../../lib/utils";

/**
 * Input / textarea with a floating label (placeholder-shown technique),
 * neon focus glow and a gradient hairline that spreads on focus.
 * Styles live in skills-contact.css (.sc-input / .sc-label / .sc-line).
 */
export const FloatingField = ({ id, name, label, type = "text", multiline = false, rows = 5, className, inputClassName, ...rest }) => {
  const Tag = multiline ? "textarea" : "input";
  return (
    <div className={cn("sc-field", className)}>
      <Tag
        id={id}
        name={name}
        type={multiline ? undefined : type}
        rows={multiline ? rows : undefined}
        placeholder=" "
        className={cn("sc-input", multiline && "min-h-[9.5rem] resize-none", inputClassName)}
        // let the textarea scroll itself instead of Lenis hijacking the wheel
        data-lenis-prevent={multiline ? "" : undefined}
        {...rest}
      />
      <label htmlFor={id} className="sc-label">
        {label}
      </label>
      <span aria-hidden className="sc-line" />
    </div>
  );
};
