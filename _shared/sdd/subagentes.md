# Política de subagentes — skills de fase do fluxo spec-anchored

> Material compartilhado. Não é uma skill.

- **Entrevista e conversa com o usuário ficam sempre no orquestrador** — nunca delegue.
- **Constituição / especificação / tarefas:** etapas majoritariamente sequenciais e
  analíticas — normalmente sem subagentes. Só considere despachar para leitura/varredura
  paralela de áreas muito distintas do código, com modelo mais barato (Haiku).
- **Planejamento:** subagentes para investigação técnica paralela e independente, Haiku
  para a leitura/varredura. As decisões de arquitetura em si ficam no orquestrador.
- **Implementação (TDD):** subagentes para grupos de tarefas explicitamente independentes;
  Haiku para tarefas de complexidade baixa, modelo padrão da sessão para média/alta. Cada
  subagente segue o loop de TDD isoladamente e sem Playwright MCP. Nunca paralelize tarefas
  com dependência entre si. Depois que os subagentes terminarem, o orquestrador revisa os
  resultados, resolve conflitos e só então marca as tarefas como concluídas.
