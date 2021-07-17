
function newUser(){

    let newUsername = document.getElementById("newUsername").value;
    let newPassword = document.getElementById("newPassword").value;
    let repeatPassword = document.getElementById("repeatPassword").value; 

    if (newUsername.length >= 2 ){
        
        if( newPassword.length >= 6 && newPassword===repeatPassword){
        
            axios.post("https://back-recado-combanco.herokuapp.com/createLogin", {email: newUsername, password: repeatPassword})
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

    axios.post("https://back-recado-combanco.herokuapp.com/login", {email: userLogin, password: passwordLogin})
    .then((response) => {
        localStorage.setItem("user", JSON.stringify(response.data.id));
        location.href = "recados.html";
    })
    .catch((error) => {
      alert(error.response.data.msg);
    });  
}

var userLocalStorage = localStorage.getItem("user");
var user = JSON.parse(userLocalStorage);

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

    axios.post("https://back-recado-combanco.herokuapp.com/recado", {titulo: descricao, descricao: detalhamento, id_login: user})
        .then((response) => {
            alert("Recado criado com sucesso");
        setTimeout(() => {
        location.reload();
        }, 2000);
        })
        .catch((error) => {
            alert(error);
        });

    descricao="";
    detalhamento="";

}

window.addEventListener("load", () => {
    axios.get("https://back-recado-combanco.herokuapp.com/recado").then((resposta) => {
      recados = resposta.data;
      tabela(recados);
    });
  });

  const elemento = document.getElementById("tabela");

function tabela(){ 
    
    let html = "";
    
    for (const recado of recados){
        html += `<tr>`;
        html += `<td>${recado.id}</td>`;
        html += `<td>${recado.titulo}</td>` ;
        html += `<td>${recado.descricao}</td>` ;
        html += `<td><button type="button" class='btn-danger' onclick='apagar(${recado.id})'>Apagar</button> <button class='btn-success' data-bs-toggle="modal" data-bs-target="#exampleModal" onclick='pegarEditar(${recado.id})'>Editar</button></td>` ;
        html += `</tr>`;
    }
    
   elemento.innerHTML = html  
}



function apagar(id){ 
    
    axios
    .delete(`https://back-recado-combanco.herokuapp.com/recado/${id}`)
    .then((response) => {
      alert("Recado apagado com sucesso");
      setTimeout(() => {
        location.reload();
      }, 1000);
    })
    .catch((error) => {
      console.log(error.response.data.msg);
    });
    

}

async function pegarEditar(id){
    const data = await axios.get(`https://back-recado-combanco.herokuapp.com/recado/${id}`).then((resposta) => {
        return resposta.data
    })

    document.getElementById("desc").value = data.titulo;
    document.getElementById("det").value = data.descricao;

    localStorage.setItem('id_recado', (data.id));

}


async function atualizar() {
  const id = localStorage.getItem("id_recado");
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

    await axios.put(`https://back-recado-combanco.herokuapp.com/recado/${id}`, {
      titulo: titulo,
      descricao: detalhes ,
      id_login: user,
      
  }).then((resposta) => {
          alert("Recado alterado com sucesso");
          location.href = "recados.html";
      
  }).catch((erro) => {
      alert(erro.response.data.msg);
  });

}

 