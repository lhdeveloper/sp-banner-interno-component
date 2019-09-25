# sp-banner-interno-component
Desenvolvimento de Banner Interno em Vue para SharePoint

## Sobre
Este component facilita a aplicação de Banners em páginas internas nos websites em **SharePoint**. Feito com PNP e CSOM, salvamos a imagem na galeria de fotos e atualizamos um campo texto na 
galeria de Páginas.

## Setup & Aplicação
* Criar uma pasta chamada **"banner-interno"** na biblioteca de imagens **"PublishingImages"**;
* Criar um campo chamado **"LinkImagem"** na Biblioteca de Páginas;
* Adicionar o js **"banner-interno.js"** no pagelayout que será utilizado;
* Adicionar uma div com o id **"banner-interno"** no local onde o banner deverá aparecer.
* Existe um SASS também feito para o banner, que contém o botão de upload personalizado e uma tela de "Aguarde" enquanto o banner carrega e substitui a imagem. as variáveis $primary, $secondary e $teritary estão vazias no início do codigo SASS, utilizo elas por conta do boostrap personalizado. 