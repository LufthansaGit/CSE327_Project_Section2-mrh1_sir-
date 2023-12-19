import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';


export default function ComboBox({val,opts=null,afterSelect,label,getOpLabel,disabled=false,checkDisable}) {
    return (
        <Autocomplete
            disablePortal
            options={opts}
            value={val||null}
            getOptionLabel={getOpLabel}
            renderInput={(params) => <TextField {...params} label={label} />}
            getOptionDisabled={checkDisable}
            blurOnSelect
            autoComplete
            clearOnEscape
            noOptionsText='No results'
            loading={!(opts?.length||true)}
            onChange={(e,v,r)=>afterSelect(v)}
            disabled={disabled}
        />
    );
}