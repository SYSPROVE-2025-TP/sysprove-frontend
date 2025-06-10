<template>
  <q-page
    class="q-pa-md bg-grey-2"
    style="height: 100vh; display: flex; flex-direction: column"
  >
    <div
      class="kanban-container row no-wrap"
      style="overflow-x: auto; flex: 1; gap: 16px; height: calc(100vh - 32px)"
    >
      <div
        v-for="(stage, index) in stages"
        :key="index"
        class="kanban-column column q-pa-sm bg-grey-3"
        style="
          min-width: 250px;
          max-width: 300px;
          border-radius: 10px;
          flex: 0 0 auto;
          height: 100%;
          display: flex;
          flex-direction: column;
        "
        :data-etapa="stage.name"
      >
        <div
          class="q-mb-sm text-center text-subtitle1 text-bold"
          :style="{ color: stage.color || 'black' }"
          style="flex-shrink: 0"
        >
          {{ stage.name }}
        </div>
        <draggable
          :list="stage.cards"
          group="sales"
          class="column q-gutter-y-sm"
          item-key="id"
          style="flex: 1; min-height: 0; overflow-y: auto; padding-bottom: 8px"
        >
          <template #item="{ element }">
            <q-card
              class="q-pa-sm bg-white"
              style="border-radius: 8px; cursor: grab; flex-shrink: 0"
              @click="openCardDetails(element)"
            >
              <div class="text-subtitle2">{{ element.title }}</div>
              <div class="text-caption">💰 {{ element.amount }}</div>
              <div class="text-caption">🚦 {{ element.priority }}</div>
            </q-card>
          </template>
        </draggable>
      </div>
    </div>

    <!-- Modal al hacer clic en la tarjeta -->
    <!-- Modal al hacer clic en la tarjeta -->
    <q-dialog v-model="dialogVisible">
      <q-card style="min-width: 500px; max-width: 90vw">
        <q-card-section>
          <div class="text-h6">{{ selectedCard?.title }}</div>
        </q-card-section>
        <q-card-section class="q-gutter-y-sm">
          <div><strong>Monto:</strong> {{ selectedCard?.amount }}</div>
          <div><strong>Prioridad:</strong> {{ selectedCard?.priority }}</div>
          <div>
            <strong>Nombre del Contacto:</strong>
            {{ selectedCard?.nombreContacto }}
          </div>
          <div><strong>Empresa:</strong> {{ selectedCard?.empresa }}</div>
          <div>
            <strong>Fecha de Inicio:</strong> {{ selectedCard?.fechaInicio }}
          </div>
          <div>
            <strong>Fecha de Cierre:</strong> {{ selectedCard?.fechaCierre }}
          </div>
          <div><strong>Estado:</strong> {{ selectedCard?.estado }}</div>
          <div><strong>Teléfono:</strong> {{ selectedCard?.telefono }}</div>
          <div><strong>Email:</strong> {{ selectedCard?.email }}</div>
          <div>
            <strong>Productos:</strong> {{ selectedCard?.productos || "-" }}
          </div>
          <div><strong>Notas:</strong> {{ selectedCard?.notas || "-" }}</div>
          <div>
            <strong>Descripción:</strong> {{ selectedCard?.descripcion || "-" }}
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cerrar" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import draggable from "vuedraggable";

const stages = ref([
  {
    name: "Calificación",
    cards: [],
  },
  {
    name: "Propuesta Técnica",
    cards: [],
  },
  {
    name: "Cotización",
    cards: [],
  },
  {
    name: "Negociación",
    cards: [
      {
        id: 1,
        title: "Oportunidad 01_Coca Cola Company",
        amount: "S/ 25,000",
        priority: "Alta",
      },
    ],
  },
  {
    name: "Cierres Ganados",
    color: "green",
    cards: [],
  },
  {
    name: "Cierres Perdidos",
    color: "red",
    cards: [],
  },
]);

// Modal state
const dialogVisible = ref(false);
const selectedCard = ref(null);

function openCardDetails(card) {
  selectedCard.value = card;
  dialogVisible.value = true;
}
</script>

<style scoped>
.kanban-container {
  height: 100%;
}

.kanban-column {
  height: 100%;
}

.kanban-container::-webkit-scrollbar {
  height: 8px;
}

.kanban-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.kanban-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.kanban-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.kanban-column .column::-webkit-scrollbar {
  width: 6px;
}

.kanban-column .column::-webkit-scrollbar-track {
  background: #f9f9f9;
  border-radius: 3px;
}

.kanban-column .column::-webkit-scrollbar-thumb {
  background: #d0d0d0;
  border-radius: 3px;
}

.kanban-column .column::-webkit-scrollbar-thumb:hover {
  background: #b0b0b0;
}
</style>
