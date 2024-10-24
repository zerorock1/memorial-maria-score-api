function calcularRankingTram() {

        
        const numeroSkills = 4
        
        const juez1 = [1,2,3,4,5,5,4,3,2,1,1]
        const juez2 = [2,2,3,4,5,5,4,3,2,1,2]
        const juez3 = [3,2,3,4,5,5,4,3,2,1,3]
        const juez4 = [4,2,3,4,5,5,4,3,2,1,4]



        const dificultad = 10.3
        const tiempoVuelo = 13.5
        const desplazamiento = 9.2
        const penalizacion = 0

        let landings = [juez1[10],juez2[10],juez3[10],juez4[10]]
        landings =  landings.sort((a, b) => a - b);

        if (landings.length > 2) {
            landings.splice(0, 1); // Eliminar el mínimo
            landings.splice(-1, 1); // Eliminar el máximo
        }

        const puntuacionLanding = landings.reduce((a, b) => a + b, 0)

        const skills = ['s1','s2','s3','s4','s5','s6','s7','s8','s9','s10']

        const puntuacionesTemporales = []

        for(let i = 0 ; i <= numeroSkills ; i++){
            let data = [juez1[i],juez2[i],juez3[i],juez4[i]];

            data =  data.sort((a, b) => a - b);

            if (data.length > 2) {
                data.splice(0, 1); // Eliminar el mínimo
                data.splice(-1, 1); // Eliminar el máximo
            }

            let obj = {
                'name':skills[i],
                'score':data
            }

            puntuacionesTemporales.push(data.reduce((a, b) => a + b, 0))
            //puntuacionesTemporales.push(obj)
    
        }
        
        const sumaEjecucion = puntuacionesTemporales.reduce((a, b) => a + b, 0)+puntuacionLanding
    
        const toScore = (numeroSkills+1)*20/10
        const putuacionTotalEjecucion = toScore-(sumaEjecucion/10)

        const puntuacionFinal = ( putuacionTotalEjecucion
            + dificultad 
            + tiempoVuelo 
            + desplazamiento)
            -penalizacion

        console.log(puntuacionFinal)

    }


    calcularRankingTram();


