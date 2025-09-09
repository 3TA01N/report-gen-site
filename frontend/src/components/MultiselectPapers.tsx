import React, { useState, useEffect } from 'react';
import api from './api'
import {
    Autocomplete,
    TextField,
    Box,
    AutocompleteChangeReason,
    AutocompleteChangeDetails,
  } from '@mui/material';
type OptionType = {
    value: string;
    label: string;
  }

type MultiSelectPapersProps = {
    passNamesToParent: (selectedNames: string[]) => void;
}

const MultiselectPapers: React.FC<MultiSelectPapersProps> =({passNamesToParent}) => {
    const [papersOptions, setOptions] = useState<OptionType[] | undefined>([])//Store options for multiselect
    
    const handleSelectPapersChange = (
        _event: React.SyntheticEvent,
        value: OptionType[],
        _reason: AutocompleteChangeReason,
        _details?: AutocompleteChangeDetails<OptionType>
      ) => {
        passNamesToParent(value.map((v) => v.label));
      };
    useEffect(() => {
        const getPapers = async() => {
            try {
                const response = await api.get('/papers/')
                const options = response.data.map((cur_paper : any) => ({
                    value: cur_paper.name,
                    label: cur_paper.name,
                }));
                setOptions(options)
            }
            catch (error:any) {
                console.log('Error fetching papers', error.response)
            }
        }
        getPapers()
    },[]);

    return (
        
        <Box>
        
        <Autocomplete
            multiple
            options={papersOptions || []}
            getOptionLabel={(option) => option.label}
            onChange={handleSelectPapersChange}
            renderInput={(params) => (
            <TextField {...params} variant="outlined" label="Papers" />
            )}
        />
        </Box>
    )
}

export default MultiselectPapers;