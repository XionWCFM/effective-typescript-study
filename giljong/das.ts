interface Vector3 {
    x:number;
    y:number;
    z:number;

}

function getComponent(vector:Vector3, axis:'x'|'y'|'z'){
    return vector[axis]
}

let x = 'x' as const
let vec = {x:10, y:20 , z:30}

getComponent(vec,x)