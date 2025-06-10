<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h5">Lista de Oportunidades</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          :rows="oportunidades"
          :columns="columnas"
          row-key="_id"
          no-data-label="No hay oportunidades sin asignar"
          flat
          bordered
        >
          <template v-slot:body-cell-acciones="props">
            <q-td :props="props">
              <q-btn
                label="Asignar Arquitecto"
                color="positive"
                @click="abrirModalAsignar(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Modal para Asignar Arquitecto -->
    <q-dialog v-model="mostrarModalAsignar">
      <q-card style="width: 600px; max-width: 90vw;">
        <q-card-section>
          <div class="text-h6">Seleccionar Arquitecto</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-table
            :rows="arquitectos"
            :columns="columnasArquitectos"
            row-key="correo"
            selection="single"
            v-model:selected="arquitectoSeleccionado"
            no-data-label="No se encontraron arquitectos de soluciones"
            flat
            bordered
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" @click="cerrarModalAsignar" />
          <q-btn
            flat
            label="Asignar"
            color="positive"
            :disable="arquitectoSeleccionado.length === 0"
            @click="mostrarConfirmacion = true"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Confirmación antes de asignar -->
    <q-dialog v-model="mostrarConfirmacion" persistent>
      <q-card>
        <q-card-section class="text-h6">
          ¿Seguro que desea guardar los cambios?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="NO" color="negative" v-close-popup />
          <q-btn flat label="SÍ" color="positive" @click="asignarArquitecto" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Éxito después de asignar -->
    <q-dialog v-model="mostrarExito">
      <q-card>
        <q-card-section class="text-h6">
          Los cambios se han guardado correctamente
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../../../api'
import { useAuthStore } from '../../../stores/auth'

const authStore = useAuthStore()

const oportunidades = ref([])
const mostrarModalAsignar = ref(false)
const mostrarConfirmacion = ref(false)
const mostrarExito = ref(false)
const oportunidadSeleccionada = ref(null)
const arquitectos = ref([])
const arquitectoSeleccionado = ref([])

const columnas = [
  { name: 'cliente', label: 'Cliente', field: row => row.cliente?.nombre || 'Sin cliente', align: 'left' },
  { name: 'tipo', label: 'Tipo', field: 'tipo', align: 'left' },
  { name: 'contacto', label: 'Contacto', field: 'contacto', align: 'left' },
  { name: 'descripcion', label: 'Descripción', field: 'descripcion', align: 'left' },
  { name: 'acciones', label: 'Acciones', align: 'center' }
]

const columnasArquitectos = [
  { name: 'nombre', label: 'Nombre', field: row => `${row.nombres} ${row.apellidos}`, align: 'left' },
  { name: 'rol', label: 'Rol', field: row => typeof row.rol === 'string' ? row.rol : row.rol?.nombre || 'Sin rol', align: 'left' },
  { name: 'carga', label: 'Carga', field: () => 'N/A', align: 'left' }
]

const cargarOportunidades = async () => {
  try {
    const res = await api.get('/propuestas', {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    oportunidades.value = res.data.filter(p => !p.arquitectoAsignado)
  } catch (err) {
    console.error('Error al cargar oportunidades:', err)
  }
}

const cargarArquitectos = async () => {
  try {
    const res = await api.get("/auth/usuarios", {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })

    arquitectos.value = res.data.filter(user => {
      if (typeof user.rol === 'string') {
        return user.rol.toLowerCase().includes('arquitecto de soluciones')
      } else if (typeof user.rol === 'object' && user.rol.nombre) {
        return user.rol.nombre.toLowerCase().includes('arquitecto de soluciones')
      }
      return false
    })
  } catch (err) {
    console.error('Error al cargar arquitectos:', err)
  }
}

const abrirModalAsignar = (row) => {
  oportunidadSeleccionada.value = row
  arquitectoSeleccionado.value = []
  mostrarModalAsignar.value = true
  cargarArquitectos()
}

const cerrarModalAsignar = () => {
  mostrarModalAsignar.value = false
  arquitectoSeleccionado.value = []
}

const asignarArquitecto = async () => {
  mostrarConfirmacion.value = false
  if (!arquitectoSeleccionado.value.length) return

  const arquitecto = arquitectoSeleccionado.value[0]

  try {
    await api.put(`/propuestas/${oportunidadSeleccionada.value._id}`, {
      arquitectoAsignado: arquitecto.correo,
      estado: 'En Proceso'
    }, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })

    // Eliminar oportunidad directamente sin recargar
    oportunidades.value = oportunidades.value.filter(
      o => o._id !== oportunidadSeleccionada.value._id
    )

    cerrarModalAsignar()
    mostrarExito.value = true
  } catch (err) {
    console.error('Error al asignar arquitecto:', err)
  }
}

onMounted(() => {
  cargarOportunidades()
})
</script>
