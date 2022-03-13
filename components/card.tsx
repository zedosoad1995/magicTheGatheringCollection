export function Card({cardImgUrl}: {cardImgUrl: string}) {

    return (
      <>
        <img src={cardImgUrl} width="500"></img>
      </>
    );
}
  
export default Card;