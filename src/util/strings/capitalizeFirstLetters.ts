export default function capitalizeFirstLetters(str: string) : string {
    return str.split(" ").map((token: string) => token.charAt(0).toUpperCase() + token.slice(1)).join(" ")
}