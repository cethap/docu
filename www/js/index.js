/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

(function($){

    window.app = {
        // Application Constructor
        initialize: function() {
            this.bindEvents();
        },

        iniPrdccion: function(){

            var _wr = function(type) {
                var orig = history[type];
                return function() {
                    var rv = orig.apply(this, arguments);
                    var e = new Event(type);
                    e.arguments = arguments;
                    window.dispatchEvent(e);
                    return rv;
                };
            };
            history.pushState = _wr('pushState'), history.replaceState = _wr('replaceState');

            window.addEventListener('replaceState', function(e) {
                if(location.hash.indexOf("series") > -1 ){
                    CnsltaPrdccion.GetSeries();
                }

                if(location.hash.indexOf("carpetas") > -1 ){
                    var $params = location.hash.split("&"), $paramSral = {};

                    for (var i = 0; i < $params.length; i++) {
                        var srlze = $params[i].split("=");
                        if(srlze.length > 0){
                            $paramSral[srlze[0]] = srlze[1];
                            console.log($paramSral);
                        }
                    }
                    CnsltaPrdccion.GetCarpetas($paramSral);
                }

            });
            
        },

        // Bind Event Listeners
        //
        // Bind any events that are required on startup. Common events are:
        // 'load', 'deviceready', 'offline', and 'online'.
        bindEvents: function() {
            document.addEventListener('deviceready', this.onDeviceReady, false);
        },
        // deviceready Event Handler
        //
        // The scope of 'this' is the event. In order to call the 'receivedEvent'
        // function, we must explicitly call 'app.receivedEvent(...);'
        onDeviceReady: function() {
            app.receivedEvent('deviceready');
        },
        // Update DOM on a Received Event
        receivedEvent: function(id) {
            var parentElement = document.getElementById(id);
            var listeningElement = parentElement.querySelector('.listening');
            var receivedElement = parentElement.querySelector('.received');

            listeningElement.setAttribute('style', 'display:none;');
            receivedElement.setAttribute('style', 'display:block;');

            console.log('Received Event: ' + id);
        }
    };

    var CnsltaPrdccion = {
        GetSeries: function(){  
            $(".table-view").html("");      
            $.ajax({
              url: 'http://192.168.1.68/docunet_movil/bin/fyii/index.php',
              type: 'GET',
              dataType: 'json',
              data: {
                'consulta_param[tipo]': 0,
                'consulta_param[target]':'',
                'consulta_param[tipo_target]':'',
                'consulta[tipoConsulta][sort]':'NOMBRE ASC',
                'Ram':'_6238rg3xu',
                'ignore':10,
                'r': 'Archivo/Sries/action/consulta/consulta[creadoPor]//consulta[descripcion]//consulta[estado]//consulta[nombre]//consulta[tipoConsulta][like]//expl//consulta[tipoConsulta][target]//'
              },
              complete: function(xhr, textStatus) {
                //called when complete
              },
              success: function(data, textStatus, xhr) {
                if(data.rows){
                    if(data.rows.length){
                        for (var i = 0; i < data.rows.length; i++) {
                            $tmpl = $("#tmpl-list-serie").clone();
                            $tmpl.removeAttr('style');
                            $(".media-body",$tmpl).html(data.rows[i].NOMBRE);
                            var $navRight = $(".navigate-right",$tmpl);
                            $navRight.attr("href",$navRight.attr("href")+"&serie="+data.rows[i].CODIGO);
                            $(".table-view").append($tmpl);
                        };
                    }
                }
              },
              error: function(xhr, textStatus, errorThrown) {
                //called when there is an error
              }
            });        
        },
        GetCarpetas: function(data){  
            $(".table-view").html("");      
            $.ajax({
              url: 'http://192.168.1.68/docunet_movil/bin/fyii/index.php',
              type: 'GET',
              dataType: 'json',
              data: {
                'consulta_param[tipo]': 0,
                'consulta_param[target]':'',
                'consulta_param[tipo_target]':'',
                'consulta[tipoConsulta][sort]':'NOMBRE ASC',
                'Ram':'_6238rg3xu',
                'ignore':10,
                'r': 'Archivo/Crptas/action/consulta/serie/'+data.serie+'/tpocarpeta//consulta[serie]/'+data.serie+'/consulta[tpocarpeta]//consulta[creadoPor]//consulta[descripcion]//consulta[estado]/0/consulta[fechaCreacionInicio]//consulta[fechaCreacionFin]//consulta[indice1]//consulta[indice2]//consulta[indice3]//consulta[indice4]//consulta[nombre]//consulta[tipoConsulta][like]/M/consulta[tipoConsulta][target]/C/expl/1/consulta[ubicacion]/'
              },
              complete: function(xhr, textStatus) {
                //called when complete
              },
              success: function(data, textStatus, xhr) {
                if(data.rows){
                    if(data.rows.length){
                        for (var i = 0; i < data.rows.length; i++) {
                            $tmpl = $("#tmpl-list-carpetas").clone();
                            $tmpl.removeAttr('style');
                            $(".media-body",$tmpl).html(data.rows[i].NOMBRE);
                            $(".table-view").append($tmpl);
                        };
                    }else{
                        $tmpl_none = $("#tmpl-list-carpetas-none").clone();
                        $tmpl_none.removeAttr('style');
                        $(".table-view").append($tmpl_none);                        
                    }
                }
              },
              error: function(xhr, textStatus, errorThrown) {
                //called when there is an error
              }
            });        
        }        
    }

})(jQuery);

