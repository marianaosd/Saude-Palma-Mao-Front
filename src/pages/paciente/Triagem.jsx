import { useEffect, useState } from 'react'
import { api } from '../../services/api.js'
import './Triagem.css'

function Triagem({ onBack, onResultado }) {
  const [categorias, setCategorias] = useState([])
  const [categoriaId, setCategoriaId] = useState('')
  const [perguntas, setPerguntas] = useState([])
  const [respostas, setRespostas] = useState({})
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [carregandoPerguntas, setCarregandoPerguntas] = useState(false)
  useEffect(() => {
    let ativo = true

    async function carregarCategorias() {
      try {
        const dados = await api('/triagem/categorias')
        if (ativo) setCategorias(dados)
      } catch (error) {
        if (ativo) setErro(error.message)
      } finally {
        if (ativo) setCarregando(false)
      }
    }

    carregarCategorias()
    return () => { ativo = false }
  }, [])

  useEffect(() => {
    let ativo = true

    if (!categoriaId) {
      setPerguntas([])
      setRespostas({})
      setCarregandoPerguntas(false)
      return
    }

    async function carregarPerguntas() {
      setErro('')
      setPerguntas([])
      setRespostas({})
      setCarregandoPerguntas(true)

      try {
        const dados = await api(
          `/triagem/categorias/${categoriaId}/perguntas`
        )

        if (ativo) {
          setPerguntas(dados)
        }
      } catch (error) {
        if (ativo) {
          setErro(error.message)
        }
      } finally {
        if (ativo) {
          setCarregandoPerguntas(false)
        }
      }
    }

    carregarPerguntas()

    return () => {
      ativo = false
    }
  }, [categoriaId])

  function atualizarResposta(pergunta, valor) {
    setRespostas((atual) => ({ ...atual, [pergunta.id]: valor }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setErro('')

    if (!categoriaId) {
      setErro('Selecione o que você está sentindo.')
      return
    }

    const payload = perguntas.map((pergunta) => {
      const valor = respostas[pergunta.id]
      const tipo = String(pergunta.tipo_resposta || '').toUpperCase()

      if (tipo === 'BOOLEAN') {
        return {
          id_pergunta: pergunta.id,
          resposta_bool: valor === 'sim'
        }
      }

      return {
        id_pergunta: pergunta.id,
        resposta_texto: String(valor || '').trim()
      }
    })

    const incompleta = perguntas.some((pergunta) => {
      const valor = respostas[pergunta.id]
      const tipo = String(pergunta.tipo_resposta || '').toUpperCase()
      if (tipo === 'BOOLEAN') return valor !== 'sim' && valor !== 'nao'
      return !String(valor || '').trim()
    })

    if (incompleta) {
      setErro('Responda todas as perguntas para continuar.')
      return
    }

    setEnviando(true)

    try {
      const resultado = await api('/triagem', {
        method: 'POST',
        body: JSON.stringify({
          id_categoria: categoriaId,
          respostas: payload
        })
      })
      const categoria = categorias.find((item) => item.id === categoriaId)

      onResultado({
        categoria,
        triagem: resultado.triagem,
        classificacao: resultado.classificacao
      })
    } catch (error) {
      setErro(error.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="triage-page" aria-labelledby="triage-page-title">
      <div className="triage-page-header">
        <button
          type="button"
          className="back-home-button"
          onClick={onBack}
        >
          ← Voltar
        </button>

        <p className="eyebrow">Pré-triagem</p>

        <h1 id="triage-page-title">
          Vamos entender como você está
        </h1>

        <p>
          Responda algumas perguntas sobre o que está sentindo.
          Suas respostas ajudam a orientar o próximo passo do atendimento.
        </p>
      </div>

      {carregando ? (
        <p className="app-empty">Carregando perguntas da pré-triagem...</p>
      ) : (
        <form className="triage-form" onSubmit={handleSubmit}>
          <fieldset className="triage-question">
            <legend>O que você está sentindo?</legend>

            {categorias.length === 0 && (
              <p className="app-empty">Nenhuma categoria de triagem cadastrada.</p>
            )}

            {categorias.map((categoria) => (
              <label className="triage-option" key={categoria.id}>
                <input
                  type="radio"
                  name="categoria"
                  value={categoria.id}
                  checked={categoriaId === categoria.id}
                  onChange={() => setCategoriaId(categoria.id)}
                />
                <span>{categoria.nome_categoria}</span>
              </label>
            ))}
          </fieldset>

          {carregandoPerguntas && (
            <p className="app-empty" role="status">
              Carregando perguntas da categoria selecionada...
            </p>
          )}

          {perguntas.map((pergunta, index) => {
            const tipo = String(pergunta.tipo_resposta || '').toUpperCase()

            return (
              <fieldset className="triage-question" key={pergunta.id}>
                <legend>{index + 1}. {pergunta.texto_pergunta}</legend>

                {tipo === 'BOOLEAN' ? (
                  <>
                    <label className="triage-option">
                      <input
                        type="radio"
                        name={pergunta.id}
                        value="sim"
                        checked={respostas[pergunta.id] === 'sim'}
                        onChange={() => atualizarResposta(pergunta, 'sim')}
                      />
                      <span>Sim</span>
                    </label>
                    <label className="triage-option">
                      <input
                        type="radio"
                        name={pergunta.id}
                        value="nao"
                        checked={respostas[pergunta.id] === 'nao'}
                        onChange={() => atualizarResposta(pergunta, 'nao')}
                      />
                      <span>Não</span>
                    </label>
                  </>
                ) : (
                  <label className="triage-option triage-option--texto">
                    <span>Sua resposta</span>
                    <textarea
                      rows={3}
                      value={respostas[pergunta.id] || ''}
                      onChange={(event) => atualizarResposta(pergunta, event.target.value)}
                      placeholder="Descreva com suas palavras"
                    />
                  </label>
                )}
              </fieldset>
            )
          })}

          <div className="triage-warning">
            <strong>Importante</strong>

            <p>
              Esta pré-triagem não substitui uma avaliação médica.
              Em situações de emergência, procure imediatamente um serviço
              de atendimento de urgência.
            </p>
          </div>

          {erro && <p className="app-feedback error" role="alert">{erro}</p>}

<button
  type="submit"
  className="primary-button triage-submit"
  disabled={
    enviando ||
    carregandoPerguntas ||
    !categoriaId ||
    perguntas.length === 0
  }
>
  {enviando ? 'Registrando...' : 'Continuar'}
</button>
        </form>
      )}
    </section>
  )
}

export default Triagem
