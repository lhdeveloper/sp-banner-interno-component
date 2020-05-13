require('../../mixins/translate');

$pnp.setup({
    headers: {
        "Accept": "application/json; odata=verbose"
    }
});

Vue.component(`banner-interno`, {
    template:`
        <div class="banner-interno">
            <template v-if="bannerImg.LinkImagem">
                <img :src="bannerImg.LinkImagem" :alt="bannerImg.Title" class="picture" />
                <div class="banner-interno-title">
                    <h4 class="title-group">{{ isEnglish ? bannerImg.TitleEN : bannerImg.Title }}</h4>
                    <h1>{{ isEnglish ? bannerImg.DescricaoEN : bannerImg.Descricao }}</h1>
                </div>
            </template>

            <div class="button-change-picture">
                <button v-if="isLogged" type="button" :disabled="uploadMsg ? true : false" @click="onClickAlterarFoto" alt="Enviar imagem"><i class="fas fa-image"></i></button>
            </div>
            <sp-file-uploader
                v-show="false"
                file-types="image"
                @files-change="onChangeFoto"
                ref="fileUploader"
                :folder-url="picFolderUrl"
            />
            <div class="uploading" v-if="uploadMsg != ''" :class="uploadMsg != '' ? 'show': ''">
                <span>{{ uploadMsg }}</span>
            </div>
        </div>
    `,
    mixins: [translateMixin],
    data(){
        return {
            picFolderUrl: '/PublishingImages/banners-internos',
            uploadMsg: '',
            pictureURL: '',
            isLogged: _spPageContextInfo.userId,
            pageID: _spPageContextInfo.pageItemId,
            bannerImg: {},
            listUrl: `${_spPageContextInfo.webServerRelativeUrl}pages`,
            blur: false,
            clientContext: '',
            listItemCol: '',
            pageName: _spPageContextInfo.serverRequestPath.toLowerCase().split('/pages/')[1]

        }
    },
    methods: {
        getList: function(){
            return $pnp.sp.web.getList(this.listUrl)
        },
        onClickAlterarFoto(){
            this.$refs.fileUploader.showUploadWindow()
        },
        onChangeFoto(files){
            if(files.length){
                this.blur = true;
                this.applyHoverEffects()
                this.uploadMsg = 'Carregando Banner';

                this.$refs.fileUploader.upload()
                    .then((result) =>{
                        var picUrl = result[0].data.ServerRelativeUrl
                        this.uploadMsg = 'Atualizando Banner';
                        this.updateBanner(picUrl);
                        return this.updateFoto(picUrl, this.pageID)
                            .then(() => {
                                this.blur = false;
                                return picUrl
                            })
                    })
                    .then((picUrl) => {
                        this.pictureURL = picUrl
                        this.uploadMsg = ''
                    })
            }
        },
        updateFoto: function(picUrl, id){
            this.blur = false;
            this.applyHoverEffects()
            return this.getList().items
                .getById(id)
                .update({
                    LinkImagem: picUrl
                }).then(() => {
                    this.publishFile()
                })
        },
        publishFile() {
            SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function(){
                var oFile;
                //Get client context and web
                var clientContext = new SP.ClientContext();
                var oWeb = clientContext.get_web();
                //Get List and File object
                var oList = oWeb.get_lists().getByTitle('Pages');
                oFile = oWeb.getFileByServerRelativeUrl(_spPageContextInfo.serverRequestPath);
                //Publish the file and execute the batch
                //oFile.publish();
                clientContext.load(oFile);
                clientContext.executeQueryAsync(function() {
                var majorVersion = oFile.get_majorVersion();
                window.location.reload();
                    }, QueryFailure);
                });

                function QueryFailure(sender,args) {
                    console.log('Request failed - '+args.get_message());
                }

        },
        updateBanner(picUrl){
            this.pictureURL = picUrl;
            $('.picture').attr('src', this.pictureURL);
            this.blur = false;
            this.applyHoverEffects()
        },
        getBannerPage(){
            return $pnp.sp.web.getList(`/pages`).items
                .filter(`Id eq ${this.pageID}`)
                .select('Title, LinkImagem,Descricao, TitleEN, DescricaoEN')
                .top(1)
                .get().then((banner) => {
                    Vue.set(this, 'bannerImg', banner[0]);
                }).catch((err) => {
                    this.threatError(err, 'Erro ao carregar o banner');
                })
        },
        threatError(err,msg){
            this.uploadMsg = `${msg} - ${err}`;
            console.error(err)
        },
        applyHoverEffects(){
            if(this.blur){
                $('.picture').attr(`style`, 'filter: blur(10px);-webkit-filter: blur(10px)');
            }else{
                $('.picture').removeAttr('style')
            }
        }
    },
    created() {
        this.getBannerPage()
    },
});

var app = new Vue({
    el: `#banner-interno`,
    template: `<banner-interno/>`
})
