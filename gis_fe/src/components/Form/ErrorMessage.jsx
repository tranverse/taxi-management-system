
export default function MessageError({message, className}){
    return(
        <>
            <p className={`text-red-500 italic text-sm mt-1 ${className}`}>{message}</p>
        </>
    )
}