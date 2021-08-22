const d=document,
      $table=d.querySelector(`.tabla`),
      $form=d.querySelector(`.formulario`),
      $h1_title=d.querySelector(`.titulo`),
      $plantilla=d.getElementById(`plantilla`).content,
      $fragmento=d.createDocumentFragment()

//-METODO DE PETICION GET CON AXIOS
const getAxios=async()=>{
    try {
        let resultado=await axios.get(`http://127.0.0.1:3000/lenguajes`)
        let datos_JSON=await resultado.data
        console.log(datos_JSON)
        datos_JSON.forEach((dato)=>{
            $plantilla.querySelector(`.tecnologia`).textContent=dato.tecnologia
            $plantilla.querySelector(`.stack`).textContent=dato.stack
            $plantilla.querySelector(`.editar`).dataset.tecnologia=dato.tecnologia
            $plantilla.querySelector(`.editar`).dataset.id=dato.id
            $plantilla.querySelector(`.editar`).dataset.stack=dato.stack
            $plantilla.querySelector(`.eliminar`).dataset.id=dato.id

            let $clon=d.importNode($plantilla,true)
            $fragmento.appendChild($clon)
        })
        $table.querySelector(`tbody`).appendChild($fragmento)
    } catch (er) {
        let mensaje=er.response.statusText || `Ocurrio un error`
        $table.insertAdjacentHTML(`afterend`,`<p><b>Error ${er.response.status}: ${mensaje}</b></p>`)
    }
}
d.addEventListener(`DOMContentLoaded`,getAxios)

//-METODO DE PETICION POST, PUT Y DELETE CON AXIOS
d.addEventListener(`submit`,async(e)=>{
    if(e.target===$form){
        e.preventDefault()
        if(!e.target.id.value){
            //-POST
            try {
                let parametros={
                    method:`POST`,
                    headers:{
                        "Content-type":`application/json;charset=utf-8`
                    },
                    data:JSON.stringify({
                        tecnologia:e.target.tecnologia.value,
                        stack:e.target.stack.value
                    })
                }
                let resultado=await axios(`http://127.0.0.1:3000/lenguajes`,parametros)
                location.reload()
            } catch (er) {
                let mensaje=er.response.statusText || `Ocurrio un error`
                $form.insertAdjacentHTML(`afterend`,`<p><b>Error ${er.response.status}: ${mensaje}</b></p>`)
            }
        }else{
            //-PUT
            try {
                let parametros={
                    method:`PUT`,
                    headers:{
                        "Content-type":`application/json;charset=utf-8`
                    },
                    data:JSON.stringify({
                        tecnologia:e.target.tecnologia.value,
                        stack:e.target.stack.value
                    })
                }
                let respuesta=await axios(`http://127.0.0.1:3000/lenguajes/${e.target.id.value}`,parametros)
                location.reload()
            } catch (er) {
                let mensaje=er.response.statusText || `Ocurrio un error`
                $form.insertAdjacentHTML(`afterend`,`<p><b>Error ${er.response.status}: ${mensaje}</b></p>`)
            }
        }
    }
})

d.addEventListener(`click`,async(e)=>{
    if(e.target.matches(`.editar`)){
        $h1_title.textContent=`EDITAR TECNOLOGIA`
        $form.tecnologia.value=e.target.dataset.tecnologia
        $form.stack.value=e.target.dataset.stack
        $form.id.value=e.target.dataset.id
    }
    if(e.target.matches(`.eliminar`)){
        let respuesta=confirm(`Seguro que deseas eliminar ${e.target.dataset.id}?`)
        //-DELETE
        if(respuesta){
            try {
                let parametros={
                    method:`DELETE`,
                    headers:{
                        "Content-type":`application/json;charset=utf-8`
                    }
                }
                let respuesta=await axios(`http://127.0.0.1:3000/lenguajes/${e.target.dataset.id}`,parametros)
                location.reload()
            } catch (er) {
                let mensaje=er.response.statusText || `Ocurrio un error`
                alert(`Error ${er.response.status}: ${mensaje}`)
            }
        }
    }
})