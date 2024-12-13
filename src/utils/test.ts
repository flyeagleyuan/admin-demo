import { expect } from 'vitest'
import { dateFormatter } from '@/utils/formatTime'
export const expectTable = (mockTableData, tableCloumn, trs, mockDataType) => {
  const dataLength = mockTableData.length
  for (let i = 0; i < dataLength; i++) {
    const user = mockTableData[i]
    const tdEles = trs[i].findAll('.cell')
    const tableColumnProps = new Map()
    tableCloumn.forEach((cloVm, index) => tableColumnProps.set(index, cloVm.vm.prop))
    const tableObj = mockTableData[0]
    tableColumnProps.forEach((key) => {
      key ? expect(tableObj.hasOwnProperty(key)).toEqual(true) : void 0
    })
    tableColumnProps.forEach((key, index) => {
      //处理string类型的数据
      mockDataType.string.forEach((item) => {
        if (item == key) {
          const userValue = user[item].toString()
          const td = tdEles[index]
          const tdText = td.text()
          expect(tdText).not.toBeNull() //td中拿到的文字
          if (userValue !== null) {
            expect(userValue).toEqual(tdText)
          } else {
            expect(tdText).toEqual('')
          }
        }
      })
      mockDataType.number.forEach((item) => {
        if (item == key) {
          const userValue = user[item]
          const td = tdEles[index]
          const tdText = Number(td.text())
          expect(tdText).not.toBeNull() //td中拿到的文字
          expect(tdText).toBeTypeOf('number')
          if (userValue !== null && tdText) {
            expect(userValue).toEqual(tdText)
          } else {
            expect(tdText).toEqual(0)
          }
        }
      })
      mockDataType?.image?.forEach((item) => {
        if (item == key) {
          const userValue = user[item]
          const td = tdEles[index]
          // console.log(userValue,tdText,'--')
          expect(userValue).toBeTypeOf('string')
          expect(userValue).toEqual(td.find('img').attributes('src'))
        }
      })
      mockDataType.date.forEach((item) => {
        if (item == key) {
          const userValue = user[item]
          const td = tdEles[index]
          const tdText = td.text()
          expect(tdText).not.toBeNull() //td中拿到的文字
          const string = dateFormatter('', '', userValue)
          if (userValue !== null) {
            expect(string).toEqual(tdText)
          } else {
            expect(tdText).toEqual('')
          }
        }
      })
    })
  }
}
export const mockForm = async (wrapper,mockFormData)=>{
  for (const key in mockFormData) {
    await wrapper.findComponent({ ref: key }).setValue(mockFormData[key])
  }
}
