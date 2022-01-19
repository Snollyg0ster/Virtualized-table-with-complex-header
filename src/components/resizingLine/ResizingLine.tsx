

interface Props {
  position: number,
  show: boolean;
  secondaryColor?: boolean;
  injectedStyle?: string;
}

const ResizingLine = (props: Props) => {
  const { position, show, injectedStyle, secondaryColor = false } = props;

  return (
    <>
      {
        show &&
        <div
          className={injectedStyle || ""}
          style={{
            position: 'absolute',
            top: 0,
            zIndex: 3,
            transform: `translateX(${position}px)`,
            width: 2,
            height: '100%',
            backgroundColor: secondaryColor ? 'gray' : '#03A9F4',
            opacity: 0.5,
            pointerEvents: 'none',
          }}
        />
      }
    </>
  );
}

export default ResizingLine;