
function newUser(){

    let newUsername = document.getElementById("newUsername").value;
    let newPassword = document.getElementById("newPassword").value;
    let repeatPassword = document.getElementById("repeatPassword").value; 

    if (newUsername.length >= 2 ){
        
        if( newPassword.length >= 6 && newPassword===repeatPassword){
        
            axios.post("https://backrecados.herokuapp.com/user", {username: newUsername, password: repeatPassword})
                .then((response) => {
                    abrirModal('successModal')
                })
                .catch((error) => {
                    alert(error.response.data.msg);
                });  
            

        } else if(newPassword.length < 6 && newPassword===repeatPassword){
            abrirModal('passwordModal')

        }else{
            abrirModal('okPasswordModal');
        };

    }else{
        abrirModal('userModal');
    }
   
}

function abrirModal(id){
    var myModal = new bootstrap.Modal(document.getElementById(id), {});
    myModal.show();
}


function entrar(){
    
    let userLogin = document.getElementById("userLogin").value;
    let passwordLogin = document.getElementById("passwordLogin").value;

    axios.post("https://backrecados.herokuapp.com/login", {username: userLogin, password: passwordLogin})
    .then((response) => {
      console.log(response.data.msg);
      location.href = "recados.html";
    })
    .catch((error) => {
      alert(error.response.data.msg);
    });  
}



function salvar(){

    let descricao = document.getElementById("descricao").value;
    let detalhamento = document.getElementById("detalhamento").value;

    if (!descricao) {
      alert("Titulo deve ser informado");
      return;
  }
  
  if (descricao.trim().length < 3) {
      alert('O titulo deve conter ao menos 3 caracteres');
      return;
  }
  
  if (!detalhamento) {
      alert("Detalhes deve ser informado");
      return;
    }

    axios.post("https://backrecados.herokuapp.com/recado", {title: descricao, detail: detalhamento})
        .then((response) => {
            alert(response.data.msg);
        setTimeout(() => {
        location.reload();
        }, 2000);
        })
        .catch((error) => {
            alert(error.response.data.msg);
        });

    descricao="";
    detalhamento="";

}

window.addEventListener("load", () => {
    axios.get("https://backrecados.herokuapp.com/recados").then((resposta) => {
      recados = resposta.data.Lista;
      tabela(recados);
    });
  });

  const elemento = document.getElementById("tabela");

function tabela(){ 
    
    let html = "";
    
    for (const recado of recados){
        html += `<tr>`;
        html += `<td>${recado.id}</td>`;
        html += `<td>${recado.title}</td>` ;
        html += `<td>${recado.detail}</td>` ;
        html += `<td><button type="button" class='btn-danger' onclick='apagar(${recado.id})'>Apagar</button> <button class='btn-success' data-bs-toggle="modal" data-bs-target="#exampleModal" onclick='pegarEditar(${recado.id})'>Editar</button></td>` ;
        html += `</tr>`;
    }
    
   elemento.innerHTML = html  
}



function apagar(id){ 
    
    axios
    .delete(`https://backrecados.herokuapp.com/recado/${id}`)
    .then((response) => {
      alert(response.data.msg);
      setTimeout(() => {
        location.reload();
      }, 1000);
    })
    .catch((error) => {
      console.log(error.response.data.msg);
    });
    

}

async function pegarEditar(id){
    const data = await axios.get(`https://backrecados.herokuapp.com/recado/${id}`).then((resposta) => {
        return resposta.data.data
    })

    document.getElementById("desc").value = data.title;
    document.getElementById("det").value = data.detail;

    localStorage.setItem('id', (data.id));

}


async function atualizar() {
  const id = localStorage.getItem("id");
  const titulo = document.getElementById("desc").value;
  const detalhes = document.getElementById("det").value;
  
  if (!titulo) {
      alert("Descrição deve ser informado");
      return;
  }

  if (titulo.trim().length < 3) {
      alert('O Descrição deve conter ao menos 3 caracteres');
      return;
  }

  if (!detalhes) {
      alert("Detalhe deve ser informado");
      return;
    }

    await axios.put(`https://backrecados.herokuapp.com/recado/${id}`, {
      title: titulo,
      detail: detalhes ,
      
  }).then((resposta) => {
          alert("Registro alterado");
          location.href = "recados.html";
      
  }).catch((erro) => {
      alert(erro.response.data.msg);
  });

}

 