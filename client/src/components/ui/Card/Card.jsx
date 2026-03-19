export default function Card({
  children,
  interactive = false,
  selected = false,
  variant = "default",
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`
        card 
        card-${variant}
        ${interactive ? "card-hover" : ""}
        ${selected ? "card-selected" : ""}
      `}
    >
      {children}
    </div>
  );
}