
type Props = {
    color: string;
    uri: string;
}

const Card = (props: Props) => {

    return (
        <>
        <div className="flex-col justify-between items-center">
            <a onClick={()=>{console.log('Clicked')}} className="cursor-pointer">
                <div className="w-64 h-48 rounded-lg m-10" style={{backgroundColor: `${props.color}`}}>

                </div>
            </a>   
            <div className="w-full flex justify-around items-center">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Use</button>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Create</button>
            </div>         
        </div>
        </>
    )

}

export default Card;