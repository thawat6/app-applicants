<template>
  <div>
    <v-container>
      <v-card class="pa-6 text-center">
        <h2>ข้อมูลผู้สมัคร</h2>
      </v-card>
    </v-container>
    <loading ref="loading" />

    <v-data-table
      v-model="selected"
      :headers="headers"
      :options.sync="options"
      :items="applicants"
      class="elevation-1"
      show-select
      item-key="id"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-col class="pa-6" cols="12" sm="6" md="6">
            <div
              style="
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <v-text-field
                v-model="infoSearchInput"
                append-icon="mdi-magnify"
                label="ค้นหาข้อมูลผู้สมัคร"
                single-line
                hide-details
                :menu-props="{ ...{ value: false } }"
              >
              </v-text-field>
            </div>
          </v-col>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="mr-3 black--text"
                @click="setDataDefault"
                color="#90E0EF"
                role="button"
                v-bind="attrs"
                v-on="on"
              >
                <span> <v-icon>mdi-plus-box</v-icon>เพิ่มข้อมูลผู้สมัคร</span>
              </v-btn>
            </template>
            <v-card>
              <v-card-title style="justify-content: center">
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-form ref="form1" v-model="valid1">
                    <v-row>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="first_name"
                          :rules="[rules.required]"
                          label="ชื่อจริง"
                          outlined
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="last_name"
                          :rules="[rules.required]"
                          label="นามสกุล"
                          outlined
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="email"
                          :rules="[rules.required]"
                          label="อีเมล"
                          outlined
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="phone_number"
                          :rules="[rules.required]"
                          label="เบอร์โทร"
                          outlined
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="address"
                          :rules="[rules.required]"
                          label="ที่อยู่"
                          outlined
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="position"
                          :rules="[rules.required]"
                          label="ตำแหน่ง"
                          outlined
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="expected_salary"
                          :rules="[rules.required]"
                          label="เงินเดือนที่คาดหวัง"
                          outlined
                          type="number"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6">
                        <v-text-field
                          v-model="years_of_experience"
                          :rules="[rules.required]"
                          label="ประสบการณ์(ปี)"
                          outlined
                          type="number"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-row justify="center">
                  <v-btn
                    class="black--text mr-5"
                    color="secondary"
                    @click="close"
                  >
                    ไม่บันทึก
                  </v-btn>
                  <v-btn color="primary" v-on:click="save()"> บันทึก </v-btn>
                </v-row>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5" style="justify-content: center"
                >ยืนยันการ ลบ ?</v-card-title
              >
              <div class="text-center">
                <v-icon size="100" color="red">mdi-delete-forever</v-icon>
              </div>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#D9D9D9" class="black--text" @click="closeDelete">
                  ไม่ลบ
                </v-btn>
                <v-btn color="red" @click="deleteItemConfirm"> ลบ </v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <ExportExcel :json="excelData" />
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn
          small
          color="#FCA311"
          @click="editItem(item)"
          class="ma-2 black--text"
        >
          แก้ไข</v-btn
        >
        <v-btn small color="red" @click="deleteItem(item)" class="ma-2">
          ลบ</v-btn
        >
      </template>
      <template v-slot:no-data>
        <h4>ขออภัย ไม่พบรายการที่ท่านค้นหา</h4>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      valid1: false,
      rules: {
        required: (value) => !!value || "จำเป็นต้องระบุ",
      },
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      address: "",
      position: "",
      expected_salary: "",
      years_of_experience: "",
      dialog: false,
      dialogDelete: false,
      infoSearchInput: "",
      options: {},
      excelData: [],
      selected: [],
      applicants: [],
      headers: [
        {
          text: "ชื่อจริง",
          value: "first_name",
        },
        {
          text: "นามสกุล",
          value: "last_name",
        },
        {
          text: "อีเมล",
          value: "email",
        },
        {
          text: "เบอร์โทร",
          value: "phone_number",
        },
        {
          text: "ที่อยู่",
          value: "address",
        },
        {
          text: "ตำแหน่ง",
          value: "position",
        },
        {
          text: "เงินเดือนที่คาดหวัง",
          value: "expected_salary",
        },
        {
          text: "ประสบการณ์(ปี)",
          value: "years_of_experience",
        },
        { text: "", align: "center", value: "actions", sortable: false },
      ],
    };
  },
  computed: {
    formTitle() {
      return this.selectedItem == null
        ? "เพิ่มข้อมูลผู้สมัคร"
        : "แก้ไขข้อมูลผู้สมัคร";
    },
  },
  watch: {
    selected: {
      handler() {
        this.excelSetData();
      },
      deep: true,
    },
    infoSearchInput: function (val) {
      this.infoSearchInput = val;
    },
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  mounted() {
    this.getApplicants();
  },
  methods: {
    getApplicants() {
      this.$loggedInApi.get(`/applicants`).then((response) => {
        this.applicants = response.data;
      });
    },
    async excelSetData() {
      console.log(this.selected);
      let json = [];

      for (let item of this.selected) {
        await json.push({
          ชื่อจริง: item.first_name,
          นามสกุล: item.last_name,
          อีเมล: item.email,
          เบอร์โทร: item.phone_number,
          ที่อยู่: item.address,
          ตำแหน่ง: item.position,
          เงินเดือนที่คาดหวัง: item.expected_salary,
          "ประสบการณ์(ปี)": item.years_of_experience,
        });
      }

      this.excelData = json;
    },

    editItem(item) {
      this.selectedItem = item;
      this.first_name = item.first_name;
      this.last_name = item.last_name;
      this.email = item.email;
      this.phone_number = item.phone_number;
      this.address = item.address;
      this.position = item.position;
      this.expected_salary = item.expected_salary;
      this.years_of_experience = item.years_of_experience;
      this.dialog = true;
    },

    deleteItem(item) {
      this.selectedItem = item;
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      this.$refs.loading.start();
      this.closeDelete();
      await this.$loggedInApi
        .delete(`/applicants/${this.selectedItem.id}/`)
        .then((response) => {
          this.getApplicants();
          this.$toast.success("ลบสำเร็จ!").goAway(1500);
          this.selectedItem = null;
          this.$refs.loading.finish();
        });
    },

    close() {
      this.dialog = false;
      this.$refs.loading.finish();
    },

    closeDelete() {
      this.dialogDelete = false;
    },
    setDataDefault() {
      this.selectedItem = null;
      this.first_name = "";
      this.last_name = "";
      this.email = "";
      this.phone_number = "";
      this.address = "";
      this.position = "";
      this.expected_salary = "";
      this.years_of_experience = "";
    },

    async save() {
      if (this.selectedItem == null) {
        this.createApplicant();
      } else {
        this.updateApplicant();
      }
    },
    createApplicant() {
      this.$refs.form1.validate();
      if (this.valid1) {
        this.$refs.loading.start();
        let data = {
          id: 1,
          first_name: this.first_name,
          last_name: this.last_name,
          email: this.email,
          phone_number: this.phone_number,
          address: this.address,
          position: this.position,
          expected_salary: this.expected_salary,
          years_of_experience: this.years_of_experience,
        };

        this.$loggedInApi
          .post(`/applicants/`, data)
          .then((response) => {
            this.getApplicants();
            this.$toast.success("เพิ่มเรียบร้อย").goAway(1500);
            this.close();
          })
          .catch((err) => {
            this.$toast.error("เพิ่มไม่สำเร็จ").goAway(1500);
            this.getApplicants();
            this.$refs.loading.finish();
          });
      }
    },
    updateApplicant() {
      this.$refs.form1.validate();
      if (this.valid1) {
        this.$refs.loading.start();
        let data = {
          id: this.selectedItem.id,
          first_name: this.first_name,
          last_name: this.last_name,
          email: this.email,
          phone_number: this.phone_number,
          address: this.address,
          position: this.position,
          expected_salary: this.expected_salary,
          years_of_experience: this.years_of_experience,
        };

        this.$loggedInApi
          .put(`/applicants/${this.selectedItem.id}/`, data)
          .then((response) => {
            this.$toast.success("แก้ไขสำเร็จ").goAway(1500);
            this.getApplicants();
            this.selectedItem = null;
            this.close();
          })
          .catch((err) => {
            this.$toast.error("แก้ไขไม่สำเร็จ").goAway(1500);
            this.getApplicants();
            this.$refs.loading.finish();
          });
      }
    },
  },
};
</script>
