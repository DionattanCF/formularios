document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const form = document.getElementById('demandaForm');
    const resetBtn = document.getElementById('resetBtn');
    const modal = document.getElementById('confirmationModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const closeModalX = document.querySelector('.close');
    const fileInput = document.getElementById('anexo');
    const filePreview = document.getElementById('filePreview');
    const outraCategoriaCheckbox = document.getElementById('cat10');
    const outraCategoriaInput = document.getElementById('outraCategoria');
    const prazoEspecificoRadio = document.getElementById('prazo1');
    const dataPrazoInput = document.getElementById('dataPrazo');
    const acompanhamentoCheckboxes = document.querySelectorAll('input[name="acompanhamento"]');
    const naoAcompanharCheckbox = document.getElementById('acompanhamento3');
    const categoriaCheckboxes = document.querySelectorAll('.categoria-checkbox');
    const categoriaError = document.getElementById('categoriaError');

    // URL do webhook para onde os dados serão enviados
    const webhookUrl = 'https://hook.eu1.make.com/YOUR_WEBHOOK_ID'; // Substitua pelo seu webhook real

    // Mostrar campo de texto quando "Outras" for selecionado na categoria
    outraCategoriaCheckbox.addEventListener('change', function() {
        if (this.checked) {
            outraCategoriaInput.style.display = 'block';
            outraCategoriaInput.focus();
        } else {
            outraCategoriaInput.style.display = 'none';
            outraCategoriaInput.value = '';
        }
    });

    // Validação de categorias - pelo menos uma deve ser selecionada
    categoriaCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            validateCategorias();
        });
    });

    function validateCategorias() {
        const anyChecked = Array.from(categoriaCheckboxes).some(checkbox => checkbox.checked);
        
        if (anyChecked) {
            categoriaError.classList.remove('visible');
            categoriaCheckboxes.forEach(cb => {
                cb.removeAttribute('required');
            });
        } else {
            categoriaError.classList.add('visible');
            // Manter o required apenas no primeiro checkbox para validação HTML5
            categoriaCheckboxes[0].setAttribute('required', '');
        }
        
        return anyChecked;
    }

    // Mostrar campo de data quando "Sim, com data específica" for selecionado
    prazoEspecificoRadio.addEventListener('change', function() {
        if (this.checked) {
            dataPrazoInput.style.display = 'block';
            dataPrazoInput.focus();
        } else {
            dataPrazoInput.style.display = 'none';
        }
    });

    // Esconder campo de data quando outra opção de prazo for selecionada
    document.querySelectorAll('input[name="prazo"]').forEach(radio => {
        if (radio.id !== 'prazo1') {
            radio.addEventListener('change', function() {
                dataPrazoInput.style.display = 'none';
            });
        }
    });

    // Lógica para as checkboxes de acompanhamento
    naoAcompanharCheckbox.addEventListener('change', function() {
        if (this.checked) {
            // Desmarcar as outras opções
            acompanhamentoCheckboxes.forEach(checkbox => {
                if (checkbox.id !== 'acompanhamento3') {
                    checkbox.checked = false;
                    checkbox.disabled = true;
                }
            });
        } else {
            // Habilitar as outras opções
            acompanhamentoCheckboxes.forEach(checkbox => {
                if (checkbox.id !== 'acompanhamento3') {
                    checkbox.disabled = false;
                }
            });
        }
    });

    // Desmarcar a opção "Não" quando outras opções forem selecionadas
    acompanhamentoCheckboxes.forEach(checkbox => {
        if (checkbox.id !== 'acompanhamento3') {
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    naoAcompanharCheckbox.checked = false;
                }
            });
        }
    });

    // Visualização prévia do arquivo
    fileInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                let previewContent = '';
                
                if (file.type.startsWith('image/')) {
                    // Se for uma imagem, mostrar thumbnail
                    previewContent = `
                        <div class="file-item">
                            <img src="${e.target.result}" alt="Preview" style="max-width: 100px; max-height: 100px;">
                            <div class="file-info">
                                <p><strong>${file.name}</strong></p>
                                <p>${(file.size / 1024).toFixed(2)} KB</p>
                            </div>
                        </div>
                    `;
                } else {
                    // Se não for uma imagem, mostrar ícone de arquivo
                    let fileIcon = 'fas fa-file';
                    
                    if (file.type.includes('pdf')) {
                        fileIcon = 'fas fa-file-pdf';
                    } else if (file.type.includes('word') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
                        fileIcon = 'fas fa-file-word';
                    } else if (file.type.includes('excel') || file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
                        fileIcon = 'fas fa-file-excel';
                    } else if (file.type.includes('zip') || file.type.includes('rar')) {
                        fileIcon = 'fas fa-file-archive';
                    }
                    
                    previewContent = `
                        <div class="file-item">
                            <i class="${fileIcon}" style="font-size: 48px; color: var(--primary-color);"></i>
                            <div class="file-info">
                                <p><strong>${file.name}</strong></p>
                                <p>${(file.size / 1024).toFixed(2)} KB</p>
                            </div>
                        </div>
                    `;
                }
                
                filePreview.innerHTML = previewContent;
                filePreview.style.display = 'flex';
            };
            
            reader.readAsDataURL(file);
        } else {
            filePreview.innerHTML = '';
            filePreview.style.display = 'none';
        }
    });

    // Função para validar o formulário
    function validateForm() {
        let isValid = true;
        
        // Validar campos obrigatórios
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                markInvalid(field);
                isValid = false;
            } else {
                markValid(field);
            }
        });
        
        // Validar categorias
        if (!validateCategorias()) {
            isValid = false;
        }
        
        // Validar categoria "Outras"
        if (outraCategoriaCheckbox.checked && !outraCategoriaInput.value.trim()) {
            markInvalid(outraCategoriaInput);
            outraCategoriaInput.style.display = 'block';
            isValid = false;
        }
        
        // Validar data de prazo
        if (prazoEspecificoRadio.checked && !dataPrazoInput.value) {
            markInvalid(dataPrazoInput);
            dataPrazoInput.style.display = 'block';
            isValid = false;
        }
        
        // Validar formato de WhatsApp
        const whatsappField = document.getElementById('whatsapp');
        const whatsappValue = whatsappField.value.trim();
        
        if (whatsappValue) {
            // Verificar se parece um número de telefone
            const phoneRegex = /^[0-9\s\(\)\+\-]{10,15}$/;
            
            if (!phoneRegex.test(whatsappValue)) {
                markInvalid(whatsappField);
                isValid = false;
                showTooltip(whatsappField, 'Por favor, insira um número de WhatsApp válido');
            }
        }
        
        // Validar formato de e-mail (se preenchido)
        const emailField = document.getElementById('email');
        const emailValue = emailField.value.trim();
        
        if (emailValue) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!emailRegex.test(emailValue)) {
                markInvalid(emailField);
                isValid = false;
                showTooltip(emailField, 'Por favor, insira um e-mail válido');
            }
        }
        
        return isValid;
    }

    // Função para marcar campo como inválido
    function markInvalid(field) {
        field.classList.add('invalid');
        field.classList.remove('valid');
        
        // Adicionar efeito de shake
        field.classList.add('shake');
        setTimeout(() => {
            field.classList.remove('shake');
        }, 500);
        
        // Scroll para o primeiro campo inválido
        if (!window.firstInvalidField) {
            window.firstInvalidField = field;
            field.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // Função para marcar campo como válido
    function markValid(field) {
        field.classList.remove('invalid');
        field.classList.add('valid');
    }

    // Função para mostrar tooltip de erro
    function showTooltip(element, message) {
        const tooltip = document.createElement('div');
        tooltip.className = 'error-tooltip';
        tooltip.textContent = message;
        
        // Posicionar o tooltip
        const rect = element.getBoundingClientRect();
        tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
        tooltip.style.left = `${rect.left + window.scrollX}px`;
        
        document.body.appendChild(tooltip);
        
        // Remover o tooltip após alguns segundos
        setTimeout(() => {
            tooltip.classList.add('fade-out');
            setTimeout(() => {
                document.body.removeChild(tooltip);
            }, 300);
        }, 3000);
    }

    // Enviar formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Resetar o primeiro campo inválido
        window.firstInvalidField = null;
        
        // Validar o formulário
        if (!validateForm()) {
            return;
        }
        
        // Coletar dados do formulário
        const formData = new FormData(form);
        const formDataObj = {};
        
        // Processar categorias selecionadas
        const categoriasSelecionadas = [];
        categoriaCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                categoriasSelecionadas.push(checkbox.value);
            }
        });
        formDataObj.categorias = categoriasSelecionadas;
        
        // Processar outros campos
        formData.forEach((value, key) => {
            // Ignorar o campo 'categoria' pois já foi processado acima
            if (key !== 'categoria') {
                // Tratar checkboxes de acompanhamento
                if (key === 'acompanhamento') {
                    if (!formDataObj[key]) {
                        formDataObj[key] = [];
                    }
                    formDataObj[key].push(value);
                } else {
                    formDataObj[key] = value;
                }
            }
        });
        
        // Adicionar categoria personalizada se necessário
        if (outraCategoriaCheckbox.checked && outraCategoriaInput.value) {
            formDataObj.categoriaPersonalizada = outraCategoriaInput.value;
        }
        
        // Adicionar timestamp
        formDataObj.dataEnvio = new Date().toISOString();
        
        // Mostrar indicador de carregamento
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        // Enviar dados para o webhook
        fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataObj)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao enviar o formulário');
            }
            return response.json();
        })
        .then(data => {
            // Mostrar modal de sucesso
            modal.style.display = 'flex';
            
            // Resetar o formulário
            form.reset();
            filePreview.innerHTML = '';
            
            // Esconder campos condicionais
            outraCategoriaInput.style.display = 'none';
            dataPrazoInput.style.display = 'none';
            
            // Habilitar todas as checkboxes de acompanhamento
            acompanhamentoCheckboxes.forEach(checkbox => {
                checkbox.disabled = false;
            });
            
            // Esconder mensagem de erro de categorias
            categoriaError.classList.remove('visible');
            
            console.log('Formulário enviado com sucesso:', data);
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.');
        })
        .finally(() => {
            // Restaurar o botão
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        });
    });

    // Resetar formulário
    resetBtn.addEventListener('click', function() {
        if (confirm('Tem certeza que deseja limpar todos os campos do formulário?')) {
            form.reset();
            filePreview.innerHTML = '';
            
            // Esconder campos condicionais
            outraCategoriaInput.style.display = 'none';
            dataPrazoInput.style.display = 'none';
            
            // Habilitar todas as checkboxes de acompanhamento
            acompanhamentoCheckboxes.forEach(checkbox => {
                checkbox.disabled = false;
            });
            
            // Remover classes de validação
            form.querySelectorAll('.valid, .invalid').forEach(field => {
                field.classList.remove('valid', 'invalid');
            });
            
            // Esconder mensagem de erro de categorias
            categoriaError.classList.remove('visible');
        }
    });

    // Fechar modal
    function closeModal() {
        modal.style.display = 'none';
    }
    
    closeModalBtn.addEventListener('click', closeModal);
    closeModalX.addEventListener('click', closeModal);
    
    // Fechar modal ao clicar fora dele
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Adicionar estilos CSS para validação e animações
    const style = document.createElement('style');
    style.textContent = `
        .invalid {
            border-color: var(--danger-color) !important;
            box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.2) !important;
        }
        
        .valid {
            border-color: var(--success-color) !important;
            box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2) !important;
        }
        
        .shake {
            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        
        @keyframes shake {
            10%, 90% { transform: translate3d(-1px, 0, 0); }
            20%, 80% { transform: translate3d(2px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
            40%, 60% { transform: translate3d(4px, 0, 0); }
        }
        
        .error-tooltip {
            position: absolute;
            background-color: var(--danger-color);
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 14px;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            animation: fadeIn 0.3s ease;
        }
        
        .error-tooltip::before {
            content: '';
            position: absolute;
            top: -6px;
            left: 10px;
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-bottom: 6px solid var(--danger-color);
        }
        
        .fade-out {
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .file-item {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .file-info {
            text-align: left;
        }
    `;
    
    document.head.appendChild(style);
    
    // Executar validação inicial de categorias
    validateCategorias();
}); 