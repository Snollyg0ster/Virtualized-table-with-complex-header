import { useMemo } from "react";


interface Props {
  position: number,
  show: boolean;
  secondaryColor?: boolean;
  injectedStyle?: string;
  vertical?: boolean;
}

const ResizingLine = (props: Props) => {
  const { position, show, injectedStyle, secondaryColor = false, vertical } = props;

  // const style = useMemo(() => vertical ? { top: 0 } : { top: 0 }, [vertical])

  return (
    <>
      {
        show &&
        <div
          className={injectedStyle || ""}
          style={{
            top: 0,
            position: 'absolute',
            zIndex: 3,
            transform: `translate${vertical ? 'X' : 'Y'}(${position}px)`,
            width: vertical ? 2 : '100%',
            height: vertical ? '100%' : 2,
            backgroundColor: secondaryColor ? 'gray' : '#03A9F4',
            opacity: 0.5,
            pointerEvents: 'none',
            //...style
          }}
        />
      }
    </>
  );
}

export default ResizingLine;

// const ResizindgLine = (props: Props) => {
//   const { position, show, injectedStyle, secondaryColor = false } = props;

//   return (
//     <>
//       {
//         show &&
//         <div
//           className={injectedStyle || ""}
//           style={{
//             position: 'absolute',
//             top: 0,
//             zIndex: 3,
//             transform: `translateX(${position}px)`,
//             width: 2,
//             height: '100%',
//             backgroundColor: secondaryColor ? 'gray' : '#03A9F4',
//             opacity: 0.5,
//             pointerEvents: 'none',
//           }}
//         />
//       }
//     </>
//   );
// }