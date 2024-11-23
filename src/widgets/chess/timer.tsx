
interface TimerProps {

    time: string;
}


const Timer: React.FC<TimerProps> = ({ time }) => {

    return (

        <div className="flex flex-row items-center h-full w-24 justify-center">
            <img src="public/icons/clock.png" alt="Clock"  className="w-5 h-5 object-cover rounded-full mr-2"/>
            <div className="scroll-m-20 text-xl font-semibold tracking-tight">{time}</div>
        </div>

    );

};

export default Timer;