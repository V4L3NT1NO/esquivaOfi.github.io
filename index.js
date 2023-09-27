
var canvas = document.getElementById('canvas');

var escenario = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight; 
var puntage = document.getElementById("puntage");
var puntos = 0;

var startButton= document.getElementById('startButton');
var menu = document.getElementById('menu');
var puntosDelMenu = document.getElementById('puntos'); 

let proyectiles = [];
let enemigos = [];
let particulas = [];


function iniciar(){
    escenario.fillStyle = 'black';
    escenario.fillRect(0,0,canvas.width,canvas.height)
    
    puntos = puntos =0;
    puntage.innerHTML = puntos;
    jugador  = new Player(window.innerWidth / 2, window.innerHeight /2, 10,'white');


    enemigos = [];
    particulas = [];
    proyectiles = [];

    

    
    
    
    
    
    
}




class Player{
    constructor(x,y,radio,color){
        this.x = x;
        this.y = y;
        this.radio = radio;
        this.color = color

    }

    draw(){
        escenario.beginPath();
        escenario.arc(this.x,this.y,this.radio,0,Math.PI * 2, false);
        escenario.fillStyle = this.color;
        escenario.fill();
    }

}
let jugador  = new Player(window.innerWidth / 2, window.innerHeight /2, 10,'white');


class Proyectil {
    constructor(x,y,radio,color,velocidad){
        this.x = x;
        this.y = y;
        this.radio = radio;
        this.color = color;
        this.velocidad = velocidad;


    }
    draw(){
        escenario.beginPath();
        escenario.arc(this.x,this.y,this.radio,0,Math.PI * 2, false);
        escenario.fillStyle = this.color;
        escenario.fill();
    }

    update(){
        this.draw();
        this.x = this.x + this.velocidad.x * 6;
        this.y = this.y + this.velocidad.y * 6;
    }
}

class Enemigos {
    constructor(x,y,radio,color,velocidad){
        this.x = x;
        this.y = y;
        this.radio = radio;
        this.color = color;
        this.velocidad = velocidad;


    }
    draw(){
        escenario.beginPath();
        escenario.arc(this.x,this.y,this.radio,0,Math.PI * 2, false);
        escenario.fillStyle = this.color;
        escenario.fill();
    }

    update(){
        this.draw();
        this.x = this.x + this.velocidad.x * 1;
        this.y = this.y + this.velocidad.y * 1;
    }
}
const friccion = 0.99;
class Particula {
    constructor(x,y,radio,color,velocidad){
        this.x = x;
        this.y = y;
        this.radio = radio;
        this.color = color;
        this.velocidad = velocidad;
        this.alpha = 1;


    }
    draw(){
        escenario.save();
        escenario.globalAlpha = this.alpha;
        escenario.beginPath();
        escenario.arc(this.x,this.y,this.radio,0,Math.PI * 2, false);
        escenario.fillStyle = this.color;
        escenario.fill();
        escenario.restore();
    }

    update(){
        this.draw();
        this.velocidad.x *= friccion;
        this.velocidad.y *= friccion;

        this.alpha -= 0.01;
        this.x = this.x + this.velocidad.x * 1;
        this.y = this.y + this.velocidad.y * 1;
    }
}








addEventListener('click', (mouse) =>{
    const angle = Math.atan2(mouse.clientY - window.innerHeight / 2,mouse.clientX - window.innerWidth / 2);
    const velocidad ={
        x: Math.cos(angle),
        y: Math.sin(angle)
    }
    proyectiles.push(new Proyectil(canvas.width / 2,canvas.height / 2,8,'white',velocidad));

} );
addEventListener('touchstart', (mouse) =>{
    const angle = Math.atan2(mouse.clientY - window.innerHeight / 2,mouse.clientX - window.innerWidth / 2);
    const velocidad ={
        x: Math.cos(angle),
        y: Math.sin(angle)
    }
    proyectiles.push(new Proyectil(canvas.width / 2,canvas.height / 2,8,'white',velocidad));

} );


function crearEnemigos(){
    setInterval(() =>{
        const radio = Math.floor (Math.random() * (45 - 5 + 1)) + 10;
        
        var x =0;
        var y = 0;
        
        if(Math.random() < 0.5){
            if (Math.random() < 0.5){
                x = 0- radio;

            }
            else{
                x = canvas.width + radio;
            }
            
            y = Math.random() * canvas.height;
        }

        else{
            if(Math.random() < 0.5){
                y = 0 -radio;
            }
            else{
                y = canvas.height + radio;
            }
            x = Math.random() * canvas.width;
        }
        
        const color = `hsl(${Math.random() * 360},100%,50%)`;
        
        const angle = Math.atan2(window.innerHeight / 2 - y,window.innerWidth / 2 - x);
        const multiplicadorDeVelocidad = Math.random() * 4
        const velocidad ={
        
        x: Math.cos(angle) * multiplicadorDeVelocidad,
        
        y: Math.sin(angle)* multiplicadorDeVelocidad
    }
    
        
        enemigos.push(new Enemigos(x,y,radio,color,velocidad))
        
        
    }, 1000);

}


var animacionId;


function animar(){
    animacionId = requestAnimationFrame(animar)
    escenario.fillStyle = 'rgba(0,0,0,0.1'; 
    escenario.fillRect(0,0,canvas.width,canvas.height);
    jugador.draw();
    particulas.forEach((particula, indexParticula) =>{
        
        if(particula.alpha <= 0){
            particulas.splice(indexParticula,1);
        }
        else{
            particula.update();
        }
    })
    proyectiles.forEach((proyectil,indexProyectil2) => {
        proyectil.update();
        if(proyectil.x - proyectil.radio < 0 || proyectil.x + proyectil.radio > canvas.width || proyectil.y - proyectil.radio < 0 || proyectil.y + proyectil.radio > canvas.height){
            setTimeout(() =>{
                proyectiles.splice(indexProyectil2,1);
                

            },0);
            
        }
    })
    enemigos.forEach((enemigo,indexEnemigo) =>{
        

    

        proyectiles.forEach((proyectil,indexProyectil) =>{
            const distancia = Math.hypot(proyectil.x - enemigo.x, proyectil.y - enemigo.y);
            //choque con proyectiles;
            if( distancia - enemigo.radio - proyectil.radio < 1){

                for(let i = 0; i < enemigo.radio; i++){
                    particulas.push(new Particula (proyectil.x,proyectil.y,Math.random() * 3.5,enemigo.color,{
                        
                        x:(Math.random() * 7) * (Math.random() - 0.5),
                        y: (Math.random()  * 7) * (Math.random() - 0.5)
                    }));
                    


                }

                if( enemigo.radio -20 > 10){
                    puntos += 10;
                    gsap.to(enemigo,{
                        radio: enemigo.radio - 20
                    });
                    
                    setTimeout(()=>{
                        
                        proyectiles.splice(indexProyectil,1);

                    },0);

                }
                else{
                    puntos += 15;
                    setTimeout(()=>{
                        
                        enemigos.splice(indexEnemigo,1);
                        proyectiles.splice(indexProyectil,1);

                    },0);
                    
                }
                puntage.innerHTML = puntos;
                
                
            }
        });

        const distanciaDelEnemigoAlJugador =Math.hypot(jugador.x - enemigo.x,jugador.y - enemigo.y);
        //terminar el juego
        if(distanciaDelEnemigoAlJugador - enemigo.radio - jugador.radio <1){
            enemigos.forEach((enemigo,indexEnemy)=>{
                enemigos.splice(indexEnemy,1);
            })
            cancelAnimationFrame(animacionId);
            puntosDelMenu.innerHTML = puntos;

            menu.style.display = 'flex';
        }
        enemigo.update();
        

    });

}
var abi = true;

startButton.addEventListener('click',()=>{
    iniciar();

    animar();

    if(abi == true){
        crearEnemigos();
        abi = abi = false;
    }

    

    menu.style.display='none';
})



